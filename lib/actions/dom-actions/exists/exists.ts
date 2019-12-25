import * as puppeteer from 'puppeteer-core';

export async function exists(selector: string, page: puppeteer.Page | undefined): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Error: cannot check that '${selector}' exists because a new page has not been created`,
    );
  }

  try {
    const result = await page.$(selector);

    if (result === null) {
      return false;
    }
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `An internal error has occured in Puppeteer API while checking if selector '${selector}'  exists`,
      error,
    );
    return false;
  }
}
