import * as puppeteer from 'puppeteer-core';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LaunchOptions extends puppeteer.LaunchOptions {}
export async function launchAction(options: Partial<LaunchOptions>): Promise<puppeteer.Browser> {
  return await require('puppeteer-core').launch(options);
}
