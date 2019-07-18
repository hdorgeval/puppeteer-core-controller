import * as puppeteer from 'puppeteer-core';
import * as action from './actions';
import { LaunchOptions, WindowState } from './actions';
import { getChromePath } from './utils/get-chrome-path';

export class PuppeteerController implements PromiseLike<void> {
  public async then<TResult1 = void, TResult2 = never>(
    onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null | undefined,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null | undefined,
  ): Promise<TResult1 | TResult2> {
    return await this.executeActions()
      .then(onfulfilled)
      .catch(onrejected);
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
  private isExecutingActions: boolean = false;
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
      this.isExecutingActions = true;
      this._lastError = undefined;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (this.actions.length === 0) {
          break;
        }
        const action = this.actions.shift();
        action && (await action());
      }
    } catch (error) {
      this._lastError = error;
    } finally {
      this.actions = [];
      this.isExecutingActions = false;
    }
  }

  private async launchAction(options: Partial<LaunchOptions>): Promise<void> {
    this.launchOptions = {
      ...this.launchOptions,
      ...options,
    };
    this.launchOptions.executablePath = this.launchOptions.executablePath || getChromePath();
    this.launchOptions.args = this.launchOptions.args || [];
    this.launchOptions.args.push(
      `--window-size=${this.windowSize.width},${this.windowSize.height}`,
    );

    this.browser = await action.launchBrowser(this.launchOptions);
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
    if (this.isExecutingActions) {
      throw new Error(
        'There are some pending actions. You should call the close() method at a later time',
      );
    }
    this.actions.push(async (): Promise<void> => await action.closeBrowser(this.browser));
    return this;
  }

  // public withWindowSize(height: number, width: number): PuppeteerController {
  //   this.windowSize = {
  //     height,
  //     width,
  //   };

  //   this.launchOptions.args = this.launchOptions.args || [];
  //   this.launchOptions.args = this.launchOptions.args.filter(
  //     (arg: string): boolean => !arg.startsWith('--window-size'),
  //   );
  //   this.launchOptions.args.push(
  //     `--window-size=${this.windowSize.width},${this.windowSize.height}`,
  //   );
  //   return this;
  // }

  public withMaxSizeWindow(): PuppeteerController {
    this.launchOptions.browserWindowShouldBeMaximized = true;
    return this;
  }

  // public withViewPortSize(height: number, width: number): PuppeteerController {
  //   this.launchOptions = {
  //     ...this.launchOptions,
  //     defaultViewport: {
  //       ...this.launchOptions.defaultViewport,
  //       width,
  //       height,
  //     },
  //   };

  //   return this;
  // }

  public async getCurrentUrl(): Promise<string> {
    return await action.getCurrentUrl(this.page);
  }
  public async getCurrentBrowserWindowState(): Promise<WindowState> {
    const result = await action.getCurrentBrowserWindowState(this.page);
    return result;
  }
}
