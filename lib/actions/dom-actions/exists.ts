import * as puppeteer from 'puppeteer-core';

export async function exists(selector: string, page: puppeteer.Page | undefined): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Error: cannot check that '${selector}' exists because a new page has not been created`,
    );
  }

  const result = await page.$(selector);

  if (result === null) {
    return false;
  }
  return true;
}
