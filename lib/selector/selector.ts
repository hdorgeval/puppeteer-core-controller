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
   * executes the search
   *
   * @returns {Promise<puppeteer.ElementHandle<Element>[]>} will return an empty array if no elements are found, will return all found elements otherwise.
   * @memberof SelectorController
   */
  public async getHandles(): Promise<puppeteer.ElementHandle<Element>[]> {
    await this.executeActions();
    return [...this.handles];
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
        this.handles = await action.getElementsWithText(
          text,
          [...this.handles],
          this.pptc.currentPage,
        );
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
