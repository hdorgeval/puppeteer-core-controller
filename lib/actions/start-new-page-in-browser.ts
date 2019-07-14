import * as puppeteer from 'puppeteer-core';

export async function startNewPageInBrowser(
  browser: puppeteer.Browser | undefined,
): Promise<puppeteer.Page> {
  if (browser) {
    return await browser.newPage();
  }
  throw new Error('Cannot create a new page because the browser has not been launched');
}
