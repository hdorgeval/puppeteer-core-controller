import * as puppeteer from 'puppeteer-core';
import { getCurrentBrowserWindowState } from './get-current-browser-window-state';
import { defaultDevice, Device } from '../page-actions/emulate-device';

export interface MinViewPort {
  /**
   * min page width in pixels.
   */
  minWidth: number;
  /**
   * min page height in pixels.
   */
  minHeight: number;
}

export interface LaunchOptions extends puppeteer.LaunchOptions {
  browserWindowShouldBeMaximized?: boolean;
  emulateDevice?: Device;
  minViewPort?: MinViewPort;
  recordFailedRequests?: boolean;
  recordPageErrors?: boolean;
  showCursor?: boolean;
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
        (error.message as string).includes('Failed to launch the browser process')
      ) {
        // no need to retry: path to chrome or firefox is incorrect
        throw error;
      }
    }
  }
  throw new Error('Cannot launch browser');
}
export async function launchBrowserWithMaxSizeWindow(
  options: Partial<LaunchOptions>,
): Promise<puppeteer.Browser> {
  const isHeadless = options.headless;
  const newOptions = {
    ...options,
    headless: false,
  };
  const browser = await tryLaunchBrowser(newOptions);
  const page = await browser.newPage();
  const windowState = await getCurrentBrowserWindowState(page);

  newOptions.headless = isHeadless || false;
  newOptions.args = newOptions.args || [];
  newOptions.args = newOptions.args.filter(
    (arg: string): boolean => !arg.startsWith('--window-size'),
  );
  newOptions.args.push(
    `--window-size=${windowState.screen.availWidth},${windowState.screen.availHeight}`,
  );

  if (
    options.minViewPort &&
    typeof options.minViewPort.minWidth === 'number' &&
    typeof options.minViewPort.minHeight === 'number'
  ) {
    const width =
      windowState.screen.availWidth < options.minViewPort.minWidth
        ? options.minViewPort.minWidth
        : windowState.screen.availWidth;

    const height =
      windowState.screen.availHeight < options.minViewPort.minHeight
        ? options.minViewPort.minHeight
        : windowState.screen.availHeight;

    newOptions.defaultViewport = {
      width,
      height,
    };
  }

  await browser.close();
  const maximizedBrowser = await require('puppeteer-core').launch(newOptions);
  return maximizedBrowser;
}

export async function launchBrowserWithEmulatedDevice(
  options: Partial<LaunchOptions>,
): Promise<puppeteer.Browser> {
  const newOptions = {
    ...options,
  };
  const device = options.emulateDevice || defaultDevice;

  newOptions.args = newOptions.args || [];
  newOptions.args = newOptions.args.filter(
    (arg: string): boolean => !arg.startsWith('--window-size'),
  );
  newOptions.args.push(`--window-size=${device.viewport.width},${device.viewport.height + 100}`);

  const emulatedDeviceBrowser = await require('puppeteer-core').launch(newOptions);
  return emulatedDeviceBrowser;
}

export async function launchBrowser(options: Partial<LaunchOptions>): Promise<puppeteer.Browser> {
  if (options.browserWindowShouldBeMaximized) {
    return await launchBrowserWithMaxSizeWindow(options);
  }

  if (options.emulateDevice) {
    return await launchBrowserWithEmulatedDevice(options);
  }

  return await tryLaunchBrowser(options);
}
