import * as puppeteer from 'puppeteer-core';
import * as action from '../actions';
import {
  LaunchOptions,
  WindowState,
  ClickOptions,
  defaultClickOptions,
  TypeTextOptions,
  defaultTypeTextOptions,
  KeyboardKey,
  KeyboardPressOptions,
  defaultKeyboardPressOptions,
  SelectOptions,
  defaultSelectOptions,
  HoverOptions,
  defaultHoverOptions,
  WaitOptions,
  defaultWaitOptions,
  mandatoryFullPageScreenshotOptions,
  MinViewPort,
} from '../actions';
import { getChromePath } from '../utils';

export type Story = (pptc: PuppeteerController) => Promise<void>;
export type StoryWithProps<T> = (pptc: PuppeteerController, props: T) => Promise<void>;

export interface ExpectAssertion {
  hasFocus: (options?: AssertOptions) => PuppeteerController;
  hasClass: (className: string, options?: AssertOptions) => PuppeteerController;
  hasExactValue: (value: string, options?: AssertOptions) => PuppeteerController;
  isDisabled: (options?: AssertOptions) => PuppeteerController;
  isEnabled: (options?: AssertOptions) => PuppeteerController;
}
export interface AssertOptions {
  timeoutInMilliseconds: number;
}
export const defaultAssertOptions: AssertOptions = {
  timeoutInMilliseconds: 30000,
};

export {
  LaunchOptions,
  WindowState,
  ClickOptions,
  TypeTextOptions,
  KeyboardKey,
  KeyboardPressOptions,
  SelectOptions,
  HoverOptions,
  WaitOptions,
  mandatoryFullPageScreenshotOptions,
  MinViewPort,
} from '../actions';

export class PuppeteerController implements PromiseLike<void> {
  /**
   * Create a controller instance by using an existing browser and page instance
   */
  constructor(browser?: puppeteer.Browser, page?: puppeteer.Page) {
    if (browser && page) {
      this.browser = browser;
      this.page = page;
    }
  }
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
  private isExecutingActions = false;
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
      this.actions = [];
      this.isExecutingActions = false;
      throw error;
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
    this.page = await action.startNewPageInBrowser(this.browser, this.launchOptions.showCursor);
  }

  public getInstances(): [puppeteer.Browser, puppeteer.Page] | [undefined, undefined] {
    if (this.browser && this.page) {
      return [this.browser, this.page];
    }

    return [undefined, undefined];
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

  public click(selector: string, options: ClickOptions = defaultClickOptions): PuppeteerController {
    this.actions.push(async (): Promise<void> => await action.click(selector, options, this.page));
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public find(selector: string, waitOptions: WaitOptions = defaultWaitOptions) {
    return {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      withText: (text: string) => {
        return {
          click: (clickOptions: ClickOptions = defaultClickOptions): PuppeteerController => {
            const mergedOptions = {
              ...defaultWaitOptions,
              ...defaultClickOptions,
              ...waitOptions,
              ...clickOptions,
            };
            this.actions.push(
              async (): Promise<void> =>
                await action.clickOnSelectorWithText(selector, text, mergedOptions, this.page),
            );
            return this;
          },
        };
      },
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      withExactText: (text: string) => {
        return {
          click: (clickOptions: ClickOptions = defaultClickOptions): PuppeteerController => {
            const mergedOptions = {
              ...defaultWaitOptions,
              ...defaultClickOptions,
              ...waitOptions,
              ...clickOptions,
            };
            this.actions.push(
              async (): Promise<void> =>
                await action.clickOnSelectorWithExactText(selector, text, mergedOptions, this.page),
            );
            return this;
          },
        };
      },
    };
  }

  public hover(
    selector: string,
    options: Partial<HoverOptions> = defaultHoverOptions,
  ): PuppeteerController {
    const mergedOptions = {
      ...defaultHoverOptions,
      ...options,
    };

    this.actions.push(
      async (): Promise<void> => await action.hover(selector, mergedOptions, this.page),
    );
    return this;
  }

  public typeText(
    text: string,
    options: TypeTextOptions = defaultTypeTextOptions,
  ): PuppeteerController {
    this.actions.push(async (): Promise<void> => await action.typeText(text, options, this.page));
    return this;
  }

  public pressKey(
    key: KeyboardKey,
    options: KeyboardPressOptions = defaultKeyboardPressOptions,
  ): PuppeteerController {
    this.actions.push(async (): Promise<void> => await action.pressKey(key, options, this.page));
    return this;
  }

  public select(
    ...values: string[]
  ): { in: (selector: string, options?: SelectOptions) => PuppeteerController } {
    return {
      in: (
        selector: string,
        options: SelectOptions = defaultSelectOptions,
      ): PuppeteerController => {
        this.actions.push(
          async (): Promise<void> => await action.select(selector, values, options, this.page),
        );
        return this;
      },
    };
  }

  public close(): PuppeteerController {
    if (this.isExecutingActions) {
      throw new Error(
        'Error: there are some pending actions. You should call the close() method at a later time',
      );
    }
    this.actions.push(async (): Promise<void> => await action.closeBrowser(this.browser));
    return this;
  }

  public runStory<T>(story: Story | StoryWithProps<T>, param?: T): PuppeteerController {
    if (typeof story !== 'function') {
      throw new Error('Error: story should be a function');
    }

    if (param) {
      this.actions.push(async (): Promise<void> => await story(this, param));
      return this;
    }

    this.actions.push(async (): Promise<void> => await (story as Story)(this));
    return this;
  }

  /**
   * Try to maximize the browser window size.
   * This method might not work on CI environment.
   * In this case setup the minViewPort parameter to ensure the page has a minimum width and height.
   * @param {MinViewPort} [minViewPort]
   * @returns {PuppeteerController}
   * @memberof PuppeteerController
   */
  public withMaxSizeWindow(minViewPort?: MinViewPort): PuppeteerController {
    this.launchOptions.browserWindowShouldBeMaximized = true;
    this.launchOptions.minViewPort = minViewPort;
    return this;
  }

  public withCursor(): PuppeteerController {
    this.launchOptions.showCursor = true;
    return this;
  }

  public async getCurrentUrl(): Promise<string> {
    return await action.getCurrentUrl(this.page);
  }
  public async getCurrentBrowserWindowState(): Promise<WindowState> {
    const result = await action.getCurrentBrowserWindowState(this.page);
    return result;
  }

  public async getValueOf(selector: string): Promise<string | undefined> {
    const result = await action.getValueOf(selector, this.page);
    return result;
  }

  public async isChecked(selector: string): Promise<boolean> {
    return await action.isChecked(selector, this.page);
  }

  public async hasFocus(selector: string): Promise<boolean> {
    return await action.hasFocus(selector, this.page);
  }

  public async isDisabled(selector: string): Promise<boolean> {
    return await action.isDisabled(selector, this.page);
  }

  public async hasClass(selector: string, className: string): Promise<boolean> {
    return await action.hasClass(selector, className, this.page);
  }
  public async hasExactValue(selector: string, value: string): Promise<boolean> {
    return await action.hasExactValue(selector, value, this.page);
  }
  public async getSelectedOptionOf(selector: string): Promise<string | null> {
    const result = await action.getSelectedOptionOf(selector, this.page);
    return result;
  }

  public async getComputedStyleOf(selector: string): Promise<CSSStyleDeclaration> {
    const result = await action.getComputedStyleOf(selector, this.page);
    return result;
  }

  public async getClientRectangleOf(selector: string): Promise<ClientRect> {
    const result = await action.getClientRectangleOf(selector, this.page);
    return result;
  }

  private async assertFor(
    predicate: () => Promise<boolean>,
    errorMessage: string | (() => Promise<string>),
    options: AssertOptions = defaultAssertOptions,
  ): Promise<void> {
    if (!this.page) {
      throw new Error('Error: expect statement only works when a page has been opened.');
    }
    const timeout = options.timeoutInMilliseconds;
    const interval = 100;
    const nbIntervals = timeout / interval;
    for (let index = 0; index < nbIntervals; index++) {
      await this.page.waitFor(interval);
      const result = await predicate();
      if (result === true) {
        return;
      }
    }

    if (typeof errorMessage === 'string') {
      throw new Error(errorMessage);
    }

    throw new Error(await errorMessage());
  }

  public expectThat(selector: string): ExpectAssertion {
    return {
      hasExactValue: (
        value: string,
        options: AssertOptions = defaultAssertOptions,
      ): PuppeteerController => {
        this.actions.push(
          async (): Promise<void> => {
            await this.assertFor(
              async (): Promise<boolean> => await this.hasExactValue(selector, value),
              async (): Promise<string> => {
                const currentValue = (await this.getValueOf(selector)) || 'undefined';
                const errorMessage = `Error: Selector '${selector}' current value is: '${currentValue}', but this does not match the expected value: '${value}'`;
                return errorMessage;
              },
              options,
            );
          },
        );
        return this;
      },

      hasClass: (
        className: string,
        options: AssertOptions = defaultAssertOptions,
      ): PuppeteerController => {
        this.actions.push(
          async (): Promise<void> => {
            const errorMessage = `Error: selector '${selector}' does not have the class '${className}'.`;
            await this.assertFor(
              async (): Promise<boolean> => await this.hasClass(selector, className),
              errorMessage,
              options,
            );
          },
        );
        return this;
      },
      hasFocus: (options: AssertOptions = defaultAssertOptions): PuppeteerController => {
        this.actions.push(
          async (): Promise<void> => {
            const errorMessage = `Error: selector '${selector}' does not have the focus.`;
            await this.assertFor(
              async (): Promise<boolean> => await this.hasFocus(selector),
              errorMessage,
              options,
            );
          },
        );
        return this;
      },
      isDisabled: (options: AssertOptions = defaultAssertOptions): PuppeteerController => {
        this.actions.push(
          async (): Promise<void> => {
            const errorMessage = `Error: selector '${selector}' is not disabled.`;
            await this.assertFor(
              async (): Promise<boolean> => await this.isDisabled(selector),
              errorMessage,
              options,
            );
          },
        );
        return this;
      },

      isEnabled: (options: AssertOptions = defaultAssertOptions): PuppeteerController => {
        this.actions.push(
          async (): Promise<void> => {
            const errorMessage = `Error: selector '${selector}' is disabled.`;
            await this.assertFor(
              async (): Promise<boolean> => !(await this.isDisabled(selector)),
              errorMessage,
              options,
            );
          },
        );
        return this;
      },
    };
  }

  public async takeFullPageScreenshotAsBase64(
    options: puppeteer.ScreenshotOptions = mandatoryFullPageScreenshotOptions,
  ): Promise<string> {
    const result = await action.takeFullPageScreenshotAsBase64(options, this.page);
    return result;
  }
}

/**
 * cast input object as a PuppeteerController instance
 * usefull when such instance is store in an untyped context
 * @param pptcInstance : an untyped PuppeteerController instance
 */
export const cast = (pptcInstance: unknown): PuppeteerController => {
  return pptcInstance as PuppeteerController;
};
