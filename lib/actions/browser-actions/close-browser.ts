import * as puppeteer from 'puppeteer-core';

export async function closeBrowser(browser: puppeteer.Browser | undefined): Promise<void> {
  await (browser && browser.close());
}
