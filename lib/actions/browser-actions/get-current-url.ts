import * as puppeteer from 'puppeteer-core';
declare const window: Window;

export async function getCurrentUrl(page: puppeteer.Page | undefined): Promise<string> {
  if (!page) {
    throw new Error('Error: cannot get current url because a new page has not been created');
  }

  try {
    const url = await page.evaluate(() => window.location.href);
    return url;
  } catch (error) {
    if (error && error.message) {
      return error.message;
    }
    return 'Cannot get current url. Please retry.';
  }
}
