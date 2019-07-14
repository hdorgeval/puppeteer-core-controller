import * as puppeteer from 'puppeteer-core';
import * as action from './actions';
import { LaunchOptions } from './actions';

export class PuppeteerController implements PromiseLike<void> {
  public then<TResult1 = void, TResult2 = never>(
    onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null | undefined,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null | undefined,
  ): PromiseLike<TResult1 | TResult2> {
    return this.executeActions().then(onfulfilled, onrejected);
  }
  private browser: puppeteer.Browser | undefined;
  private page: puppeteer.Page | undefined;
  private windowSize: { height: number; width: number } = {
    width: 800,
    height: 600,
  };
  private _lastError?: Error;
  public get lastError(): Error | undefined {
    return this._lastError;
  }

  private actions: (() => Promise<void>)[] = [];
  private launchOptions: Partial<LaunchOptions> = {
    defaultViewport: {
      width: this.windowSize.width,
      height: this.windowSize.height,
      deviceScaleFactor: 1,
      isLandscape: false,
    },
    args: [`--window-size=${this.windowSize.width},${this.windowSize.height}`],
  };

  private async executeActions(): Promise<void> {
    try {
      this._lastError = undefined;
      for (let index = 0; index < this.actions.length; index++) {
        await this.actions[index]();
      }
    } catch (error) {
      this._lastError = error;
    } finally {
      this.actions = [];
    }
  }

  private async launchAction(options: Partial<LaunchOptions>): Promise<void> {
    this.launchOptions = {
      ...this.launchOptions,
      ...options,
    };

    this.browser = await action.launchAction(this.launchOptions);
  }

  private async startNewPage(): Promise<void> {
    this.page = await action.startNewPageInBrowser(this.browser);
  }

  public initWith(options: Partial<LaunchOptions>): PuppeteerController {
    this.actions.push(async (): Promise<void> => await this.launchAction(options));
    this.actions.push(async (): Promise<void> => await this.startNewPage());
    return this;
  }

  public navigateTo(url: string): PuppeteerController {
    this.actions.push(async (): Promise<void> => await action.navigateTo(url, this.page));
    return this;
  }

  public close(): PuppeteerController {
    this.actions.push(async (): Promise<void> => await action.closeBrowser(this.browser));
    return this;
  }

  public withWindowSize(height: number, width: number): PuppeteerController {
    this.windowSize = {
      height,
      width,
    };

    this.launchOptions.args = this.launchOptions.args || [];
    this.launchOptions.args = this.launchOptions.args.filter(
      (arg: string): boolean => !arg.startsWith('--window-size'),
    );
    this.launchOptions.args.push(
      `--window-size=${this.windowSize.width},${this.windowSize.height}`,
    );
    return this;
  }

  public withMaxSizeWindow(): PuppeteerController {
    this.launchOptions.args = this.launchOptions.args || [];
    this.launchOptions.args = this.launchOptions.args.filter(
      (arg: string): boolean => !arg.startsWith('--window-size'),
    );
    this.launchOptions.args.push('--start-maximized');
    return this;
  }

  public withViewPortSize(height: number, width: number): PuppeteerController {
    this.launchOptions = {
      ...this.launchOptions,
      defaultViewport: {
        ...this.launchOptions.defaultViewport,
        width,
        height,
      },
    };

    return this;
  }

  public async getCurrentUrl(): Promise<string> {
    return await action.getCurrentUrl(this.page);
  }
}
