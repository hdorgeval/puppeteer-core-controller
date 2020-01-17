import * as puppeteer from 'puppeteer-core';
import * as action from '../actions';
import { PuppeteerController } from '../controller';
export type Action = (
  handles: puppeteer.ElementHandle<Element>[],
) => Promise<puppeteer.ElementHandle<Element>[]>;

export interface ActionInfoWithoutParam {
  name: 'parent';
}
export interface ActionInfoWithSelector {
  name: 'querySelectorAllInPage' | 'find';
  selector: string;
}
export interface ActionInfoWithText {
  name: 'withText' | 'withValue';
  text: string;
}
export interface ActionInfoWithIndex {
  name: 'nth';
  index: number;
}

export type ActionInfo =
  | ActionInfoWithoutParam
  | ActionInfoWithSelector
  | ActionInfoWithText
  | ActionInfoWithIndex;

export class SelectorController {
  private chainingHistory = '';
  private pptc: PuppeteerController;

  private actions: Action[] = [];
  private actionInfos: ActionInfo[] = [];

  // private getAction(actionInfo: ActionInfo): Action {
  //   switch (actionInfo.name) {
  //     case 'querySelectorAllInPage':
  //       // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  //       return () => action.querySelectorAllInPage(actionInfo.selector, this.pptc.currentPage);

  //     case 'find':
  //       // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  //       return (handles) => action.querySelectorAllFromElements(actionInfo.selector, [...handles]);

  //     case 'withText':
  //       // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  //       return (handles) => action.getElementsWithText(actionInfo.text, [...handles]);

  //     case 'withValue':
  //       // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  //       return (handles) => action.getElementsWithValue(actionInfo.text, [...handles]);

  //     case 'nth':
  //     default:
  //       throw new Error(`Action '${actionInfo.name}' is not yet implemented`);
  //   }
  // }

  private async executeActions(): Promise<puppeteer.ElementHandle<Element>[]> {
    let handles: puppeteer.ElementHandle<Element>[] = [];
    for (let index = 0; index < this.actions.length; index++) {
      handles = await this.actions[index]([...handles]);
    }
    return handles;
  }

  /**
   * Executes the search.
   * The result may differ from one execution to another
   * especially if targeted element is rendered lately because its data is based on some backend response.
   *
   * @returns {Promise<puppeteer.ElementHandle<Element>[]>} will return an empty array if no elements are found, will return all found elements otherwise.
   * @memberof SelectorController
   */
  public async getHandles(): Promise<puppeteer.ElementHandle<Element>[]> {
    const handles = await this.executeActions();
    return handles;
  }

  /**
   * Executes the search and returns the first found element.
   * The result may differ from one execution to another
   * especially if targeted element is rendered lately because its data is based on some backend response.
   *
   * @returns {Promise<puppeteer.ElementHandle<Element> | null>} will return null if no elements are found, will return first found element otherwise.
   * @memberof SelectorController
   */
  public async getFirstHandleOrNull(): Promise<puppeteer.ElementHandle<Element> | null> {
    const handles = await this.executeActions();
    if (handles.length === 0) {
      return null;
    }
    return handles[0];
  }

  /**
   * Gets the number of found elements.
   * The result may differ from one execution to another
   * especially if targeted element is rendered lately because its data is based on some backend response.
   *
   * @returns {Promise<number>} will return 0 if no elements are found.
   * @memberof SelectorController
   */
  public async count(): Promise<number> {
    const handles = await this.executeActions();
    return handles.length;
  }

  /**
   * Checks if the selector is visible.
   * If the selector targets multiple DOM elements, this check is done only on the first one found.
   * The result may differ from one execution to another
   * especially if targeted element is rendered lately because its data is based on some backend response.
   * So the visibilty status is the one known when executing this method.
   * @returns {Promise<boolean>}
   * @memberof SelectorController
   */
  public async isVisible(): Promise<boolean> {
    const handle = await this.getFirstHandleOrNull();
    if (handle === null) {
      return false;
    }

    const isElementVisible = await action.isHandleVisible(handle);
    return isElementVisible;
  }

  /**
   * Checks if the selector is disabled.
   * If the selector targets multiple DOM elements, this check is done only on the first one found.
   * The result may differ from one execution to another
   * especially if targeted element is rendered lately because its data is based on some backend response.
   * So the disability status is the one known when executing this method.
   *
   * @returns {Promise<boolean>}
   * @memberof SelectorController
   */
  public async isDisabled(): Promise<boolean> {
    const handle = await this.getFirstHandleOrNull();
    const isElementDisabled = await action.isHandleDisabled(handle);
    return isElementDisabled;
  }

  /**
   * Checks if selector exists.
   * The result may differ from one execution to another
   * especially if targeted element is rendered lately because its data is based on some backend response.
   * So the disability status is the one known when executing this method.
   *
   * @returns {Promise<boolean>}
   * @memberof SelectorController
   */
  public async exists(): Promise<boolean> {
    const handle = await this.getFirstHandleOrNull();
    if (handle === null) {
      return false;
    }

    return true;
  }

  /**
   * Checks if selector does not exist.
   * The result may differ from one execution to another
   * especially if targeted element is rendered lately because its data is based on some backend response.
   * So the disability status is the one known when executing this method.
   *
   * @returns {Promise<boolean>}
   * @memberof SelectorController
   */
  public async doesNotExist(): Promise<boolean> {
    const handle = await this.getFirstHandleOrNull();
    if (handle === null) {
      return true;
    }

    return false;
  }
  /**
   *
   */
  constructor(selector: string, pptc: PuppeteerController) {
    this.pptc = pptc;
    this.chainingHistory = `selector(${selector})`;
    this.actions.push(() => action.querySelectorAllInPage(selector, this.pptc.currentPage));
    this.actionInfos.push({ name: 'querySelectorAllInPage', selector });
  }

  public toString(): string {
    return this.chainingHistory;
  }

  public find(selector: string): SelectorController {
    this.actions.push((handles) => action.querySelectorAllFromElements(selector, [...handles]));
    this.actionInfos.push({ name: 'find', selector });

    this.chainingHistory = `${this.chainingHistory}
  .find(${selector})`;

    return this;
  }

  /**
   * Finds, from previous search, all elements whose innerText contains the specified text
   *
   * @param {string} text
   * @returns {SelectorController}
   * @memberof SelectorController
   */
  public withText(text: string): SelectorController {
    this.actions.push((handles) => action.getElementsWithText(text, [...handles]));
    this.actionInfos.push({ name: 'withText', text });

    this.chainingHistory = `${this.chainingHistory}
  .withText(${text})`;

    return this;
  }

  /**
   * Finds, from previous search, all elements whose value contains the specified text
   *
   * @param {string} text
   * @returns {SelectorController}
   * @memberof SelectorController
   */
  public withValue(text: string): SelectorController {
    this.actions.push((handles) => action.getElementsWithValue(text, [...handles]));
    this.actionInfos.push({ name: 'withValue', text });

    this.chainingHistory = `${this.chainingHistory}
  .withValue(${text})`;

    return this;
  }

  public parent(): SelectorController {
    this.actions.push((handles) => action.getParentsOf([...handles]));
    this.actionInfos.push({ name: 'parent' });

    this.chainingHistory = `${this.chainingHistory}
  .parent()`;

    return this;
  }

  /**
   * Takes the nth element found at the previous step
   *
   * @param {number} index : 1-based index
   * @returns {SelectorController}
   * @memberof SelectorController
   * @example
   * nth(1): take the first element found at previous step.
   * nth(-1): take the last element found at previous step.
   */
  public nth(index: number): SelectorController {
    this.actions.push((handles) => action.getNthElement(index, [...handles]));
    this.actionInfos.push({ name: 'nth', index });

    this.chainingHistory = `${this.chainingHistory}
  .nth(${index})`;

    return this;
  }
}
