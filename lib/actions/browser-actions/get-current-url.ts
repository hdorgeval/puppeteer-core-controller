import * as puppeteer from 'puppeteer-core';
declare const window: Window;

export async function getCurrentUrl(page: puppeteer.Page | undefined): Promise<string> {
  if (page) {
    const url = await page.evaluate((): Promise<string> => Promise.resolve(window.location.href));
    return url;
  }
  throw new Error('Cannot get current url because a new page has not been created');
}
