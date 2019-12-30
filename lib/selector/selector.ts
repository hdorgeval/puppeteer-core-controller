import * as puppeteer from 'puppeteer-core';
import * as action from '../actions';
import { PuppeteerController } from '../controller';
export class SelectorController {
  private chainingHistory = '';
  private pptc: PuppeteerController;

  private actions: (() => Promise<void>)[] = [];
  private handles: puppeteer.ElementHandle<Element>[] = [];

  private async executeActions(): Promise<void> {
    this.handles = [];
    for (let index = 0; index < this.actions.length; index++) {
      await this.actions[index]();
    }
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
    await this.executeActions();
    return [...this.handles];
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
    await this.executeActions();
    if (this.handles.length === 0) {
      return null;
    }
    return this.handles[0];
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
    await this.executeActions();
    return this.handles.length;
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
    const handles = await this.getHandles();
    if (handles.length === 0) {
      return false;
    }

    const handle = handles[0];
    const isElementVisible = await action.isHandleVisible(handle);
    return isElementVisible;
  }

  /**
   *
   */
  constructor(selector: string, pptc: PuppeteerController) {
    this.pptc = pptc;
    this.chainingHistory = `selector(${selector})`;
    this.actions.push(
      async (): Promise<void> => {
        this.handles = await action.querySelectorAllInPage(selector, this.pptc.currentPage);
      },
    );
  }

  public toString(): string {
    return this.chainingHistory;
  }

  public find(selector: string): SelectorController {
    this.actions.push(
      async (): Promise<void> => {
        this.handles = await action.querySelectorAllFromElements(
          selector,
          [...this.handles],
          this.pptc.currentPage,
        );
      },
    );

    this.chainingHistory = `${this.chainingHistory}
  .find(${selector})`;

    return this;
  }

  public withText(text: string): SelectorController {
    this.actions.push(
      async (): Promise<void> => {
        this.handles = await action.getElementsWithText(text, [...this.handles]);
      },
    );

    this.chainingHistory = `${this.chainingHistory}
  .withText(${text})`;

    return this;
  }

  public parent(): SelectorController {
    this.actions.push(
      async (): Promise<void> => {
        this.handles = await action.getParentsOf([...this.handles], this.pptc.currentPage);
      },
    );

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
    this.actions.push(
      async (): Promise<void> => {
        if (index === 0) {
          throw new Error('Index is one-based');
        }
        if (Math.abs(index) > this.handles.length) {
          this.handles = [];
          return;
        }

        if (index > 0) {
          let nthHandle: puppeteer.ElementHandle<Element> | undefined;
          for (let i = 1; i <= index; i++) {
            nthHandle = this.handles.shift();
          }
          nthHandle ? (this.handles = [nthHandle]) : (this.handles = []);
          return;
        }

        if (index < 0) {
          let nthHandle: puppeteer.ElementHandle<Element> | undefined;
          for (let i = 1; i <= -index; i++) {
            nthHandle = this.handles.pop();
          }
          nthHandle ? (this.handles = [nthHandle]) : (this.handles = []);
          return;
        }
      },
    );

    this.chainingHistory = `${this.chainingHistory}
  .nth(${index})`;

    return this;
  }
}
