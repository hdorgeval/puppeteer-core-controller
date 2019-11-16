import * as puppeteer from 'puppeteer-core';
import { showMousePosition } from '../dom-actions';

export async function startNewPageInBrowser(
  browser: puppeteer.Browser | undefined,
  showCursor = false,
): Promise<puppeteer.Page> {
  if (browser && showCursor) {
    const page = await browser.newPage();
    await showMousePosition(page);
    return page;
  }

  if (browser) {
    return await browser.newPage();
  }
  throw new Error('Error: cannot create a new page because the browser has not been launched');
}
