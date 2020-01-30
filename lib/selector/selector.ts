import * as puppeteer from 'puppeteer-core';
import * as action from '../actions';
import { PuppeteerController, ClickOptions } from '../controller';
import { defaultClickOptions, defaultHoverOptions } from '../actions';
import { sleep } from '../utils';
export type Action = (
  handles: puppeteer.ElementHandle<Element>[],
) => Promise<puppeteer.ElementHandle<Element>[]>;

export interface ActionInfoWithoutParam {
  name: 'parent' | 'unknown';
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

export interface SelectorState {
  actions: ActionInfo[];
  chainingHistory: string;
}

export class SelectorController {
  private chainingHistory = '';
  private pptc: PuppeteerController;

  private actionInfos: ActionInfo[] = [];

  private getActionFrom(actionInfo: ActionInfo): Action {
    switch (actionInfo.name) {
      case 'querySelectorAllInPage':
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        return () => action.querySelectorAllInPage(actionInfo.selector, this.pptc.currentPage);

      case 'find':
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        return (handles) => action.querySelectorAllFromElements(actionInfo.selector, [...handles]);

      case 'nth':
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        return (handles) => action.getNthElement(actionInfo.index, [...handles]);

      case 'parent':
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        return (handles) => action.getParentsOf([...handles]);

      case 'withText':
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        return (handles) => action.getElementsWithText(actionInfo.text, [...handles]);

      case 'withValue':
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        return (handles) => action.getElementsWithValue(actionInfo.text, [...handles]);

      default:
        throw new Error(`Action '${actionInfo.name}' is not yet implemented`);
    }
  }

  private async executeActions(): Promise<puppeteer.ElementHandle<Element>[]> {
    let handles: puppeteer.ElementHandle<Element>[] = [];
    for (let index = 0; index < this.actionInfos.length; index++) {
      const action = this.getActionFrom(this.actionInfos[index]);
      handles = await action([...handles]);
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
   * Checks if selector has specified class.
   * If the selector targets multiple DOM elements, this check is done only on the first one found.
   * The result may differ from one execution to another
   * especially if targeted element is rendered lately because its data is based on some backend response.
   * @param {string} className
   * @returns {Promise<boolean>}
   * @memberof SelectorController
   */
  public async hasClass(className: string): Promise<boolean> {
    const handle = await this.getFirstHandleOrNull();
    const classList = await action.getClassListOfHandle(handle);
    const hasClass = classList.filter((c) => c === className).length > 0;
    return hasClass;
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
  constructor(selector: string, pptc: PuppeteerController, stringifiedState?: string) {
    this.pptc = pptc;

    if (stringifiedState) {
      const state = JSON.parse(stringifiedState) as SelectorState;
      this.chainingHistory = state.chainingHistory;
      this.actionInfos = state.actions;
      return;
    }

    this.chainingHistory = `selector(${selector})`;
    this.actionInfos.push({ name: 'querySelectorAllInPage', selector });
  }

  public toString(): string {
    return this.chainingHistory;
  }

  private createSelectorFrom(
    selector: string,
    actions: ActionInfo[],
    chainingHistory: string,
  ): SelectorController {
    const state: SelectorState = {
      actions,
      chainingHistory,
    };

    return new SelectorController(selector, this.pptc, JSON.stringify(state));
  }
  public find(selector: string): SelectorController {
    const actions = [...this.actionInfos];
    actions.push({ name: 'find', selector });

    const chainingHistory = `${this.chainingHistory}
  .find(${selector})`;

    return this.createSelectorFrom(selector, actions, chainingHistory);
  }

  /**
   * Finds, from previous search, all elements whose innerText contains the specified text
   *
   * @param {string} text
   * @returns {SelectorController}
   * @memberof SelectorController
   */
  public withText(text: string): SelectorController {
    const actions = [...this.actionInfos];
    actions.push({ name: 'withText', text });

    const chainingHistory = `${this.chainingHistory}
  .withText(${text})`;

    return this.createSelectorFrom(text, actions, chainingHistory);
  }

  /**
   * Finds, from previous search, all elements whose value contains the specified text
   *
   * @param {string} text
   * @returns {SelectorController}
   * @memberof SelectorController
   */
  public withValue(text: string): SelectorController {
    const actions = [...this.actionInfos];
    actions.push({ name: 'withValue', text });

    const chainingHistory = `${this.chainingHistory}
  .withValue(${text})`;

    return this.createSelectorFrom(text, actions, chainingHistory);
  }

  public parent(): SelectorController {
    const actions = [...this.actionInfos];
    actions.push({ name: 'parent' });

    const chainingHistory = `${this.chainingHistory}
  .parent()`;

    return this.createSelectorFrom('', actions, chainingHistory);
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
    const actions = [...this.actionInfos];
    actions.push({ name: 'nth', index });

    const chainingHistory = `${this.chainingHistory}
  .nth(${index})`;

    return this.createSelectorFrom('', actions, chainingHistory);
  }

  /**
   * Click on the selector.
   * This method automatically waits for the selector to appear in the DOM;
   * Then hover over the selector;
   * Then clicks on the selector.
   * @param {ClickOptions} [options=defaultClickOptions]
   * @returns {Promise<void>}
   * @memberof SelectorController
   */
  public async click(options: ClickOptions = defaultClickOptions): Promise<void> {
    await this.pptc.waitUntil(
      () => this.exists(),
      {
        timeoutInMilliseconds: options.timeoutInMilliseconds,
        throwOnTimeout: true,
      },
      `Cannot click on ${this.toString()} because this selector was not found in DOM`,
    );

    const handle = await this.getFirstHandleOrNull();
    await action.scrollToHandle(handle);

    await this.pptc.waitUntil(
      () => this.isVisible(),
      {
        timeoutInMilliseconds: options.timeoutInMilliseconds,
        throwOnTimeout: true,
      },
      `Cannot click on ${this.toString()} because this selector is not visible`,
    );

    await action.waitUntilHandleDoesNotMove(handle, this.toString(), {
      timeoutInMilliseconds: options.timeoutInMilliseconds,
    });

    for (let index = 0; index < 3; index++) {
      await sleep(50);
      const clientRectangle = await action.getClientRectangleOfHandle(handle);
      if (clientRectangle === null) {
        continue;
      }
      const x = clientRectangle.left + clientRectangle.width / 2;
      const y = clientRectangle.top + clientRectangle.height / 2;
      this.pptc &&
        this.pptc.currentPage &&
        (await this.pptc.currentPage.mouse.move(x, y, { steps: defaultHoverOptions.steps }));
    }

    await handle?.click(options);
  }
}
