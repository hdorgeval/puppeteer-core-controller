import * as puppeteer from 'puppeteer-core';
import { getCurrentBrowserWindowState } from './get-current-browser-window-state';

export interface LaunchOptions extends puppeteer.LaunchOptions {
  browserWindowShouldBeMaximized?: boolean;
}
export async function launchBrowser(options: Partial<LaunchOptions>): Promise<puppeteer.Browser> {
  if (!options.browserWindowShouldBeMaximized) {
    return await require('puppeteer-core').launch(options);
  }
  const isHeadless = options.headless;
  const newOptions = {
    ...options,
    headless: true,
  };
  const browser = await require('puppeteer-core').launch(newOptions);
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

  await browser.close();
  const maximizedBrowser = await require('puppeteer-core').launch(newOptions);
  return Promise.resolve(maximizedBrowser);
}
