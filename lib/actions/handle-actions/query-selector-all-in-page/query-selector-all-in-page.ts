import * as puppeteer from 'puppeteer-core';

export async function querySelectorAllInPage(
  selector: string,
  page: puppeteer.Page | undefined,
): Promise<puppeteer.ElementHandle<Element>[]> {
  if (!page) {
    throw new Error(
      `Error: cannot query selector '${selector}' because a new page has not been created`,
    );
  }

  const elements = await page.$$(selector);
  return elements;
}
