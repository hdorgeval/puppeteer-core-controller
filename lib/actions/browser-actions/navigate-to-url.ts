import * as puppeteer from 'puppeteer-core';

export async function navigateTo(url: string, page: puppeteer.Page | undefined): Promise<void> {
  if (page) {
    await page.goto(url);
    return;
  }
  throw new Error(`Cannot navigate to '${url}' because a new page has not been created`);
}
