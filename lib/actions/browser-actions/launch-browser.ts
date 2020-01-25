import * as puppeteer from 'puppeteer-core';
import { getCurrentBrowserWindowState } from './get-current-browser-window-state';
import { DeviceName } from '../page-actions/emulate-device';

export interface MinViewPort {
  /**
   * min page width in pixels.
   */
  minWidth?: number;
  /**
   * min page height in pixels.
   */
  minHeight?: number;
}

export interface LaunchOptions extends puppeteer.LaunchOptions {
  browserWindowShouldBeMaximized?: boolean;
  showCursor?: boolean;
  minViewPort?: MinViewPort;
  recordFailedRequests?: boolean;
  recordPageErrors?: boolean;
  emulateDevice?: DeviceName;
}

async function tryLaunchBrowser(options: Partial<LaunchOptions>): Promise<puppeteer.Browser> {
  const maxRetries = 3;

  for (let index = 0; index <= maxRetries; index++) {
    try {
      const browser = await require('puppeteer-core').launch(options);
      return browser;
    } catch (error) {
      if (index >= maxRetries) {
        throw error;
      }
      if (
        error.message &&
        typeof error.message === 'string' &&
        (error.message as string).includes('Failed to launch chrome') &&
        (error.message as string).includes('Inconsistency detected by ld.so')
      ) {
        // eslint-disable-next-line no-console
        console.warn(`an error has occured while launching the browser by puppeteer:`);
        if (error.message) {
          // eslint-disable-next-line no-console
          console.warn(`${error.message}`);
        }
        // eslint-disable-next-line no-console
        console.warn(`retrying to launch the browser ...`);
        continue;
      }

      if (
        error.message &&
        typeof error.message === 'string' &&
        (error.message as string).includes('Failed to launch chrome')
      ) {
        // no need to retry: path to chrome is incorrect
        throw error;
      }
    }
  }
  throw new Error('Cannot launch browser');
}

export async function launchBrowser(options: Partial<LaunchOptions>): Promise<puppeteer.Browser> {
  if (!options.browserWindowShouldBeMaximized) {
    return await tryLaunchBrowser(options);
  }
  const isHeadless = options.headless;
  const newOptions = {
    ...options,
    headless: false,
  };
  const browser = await tryLaunchBrowser(newOptions);
  const page = await browser.newPage();
  const windowState = await getCurrentBrowserWindowState(page);

  newOptions.args = newOptions.args || [];
  newOptions.args = newOptions.args.filter(
    (arg: string): boolean => !arg.startsWith('--window-size'),
  );
  newOptions.args.push(
    `--window-size=${windowState.screen.availWidth},${windowState.screen.availHeight}`,
  );
  newOptions.defaultViewport = newOptions.defaultViewport || {};
  newOptions.defaultViewport.width = windowState.screen.availWidth;
  newOptions.defaultViewport.height = windowState.screen.availHeight;
  newOptions.headless = isHeadless || false;

  if (
    options.minViewPort &&
    typeof options.minViewPort.minWidth === 'number' &&
    windowState.screen.availWidth < options.minViewPort.minWidth
  ) {
    newOptions.defaultViewport.width = options.minViewPort.minWidth;
  }

  if (
    options.minViewPort &&
    typeof options.minViewPort.minHeight === 'number' &&
    windowState.screen.availHeight < options.minViewPort.minHeight
  ) {
    newOptions.defaultViewport.height = options.minViewPort.minHeight;
  }

  await browser.close();
  const maximizedBrowser = await require('puppeteer-core').launch(newOptions);
  return maximizedBrowser;
}
