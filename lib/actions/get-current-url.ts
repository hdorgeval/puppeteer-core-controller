import * as puppeteer from 'puppeteer-core';

export async function getCurrentUrl(page: puppeteer.Page | undefined): Promise<string> {
  if (page) {
    const url = await page.evaluate(
      // eslint-disable-next-line no-undef
      (): Promise<string> => Promise.resolve((window as Window).location.href),
    );
    return url;
  }
  throw new Error('Cannot get current url because a new page has not been created');
}
