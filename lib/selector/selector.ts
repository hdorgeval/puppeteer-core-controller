import * as puppeteer from 'puppeteer-core';
import * as action from '../actions';
import { PuppeteerController } from '../controller';
export class SelectorController {
  private chainingHistory = '';
  private pptc: PuppeteerController;

  private actions: (() => Promise<void>)[] = [];
  private handles: puppeteer.ElementHandle<Element>[] = [];

  private async executeActions(): Promise<void> {
    for (let index = 0; index < this.actions.length; index++) {
      await this.actions[index]();
    }
  }

  public async getHandles(): Promise<puppeteer.ElementHandle<Element>[]> {
    await this.executeActions();
    return this.handles;
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
}
