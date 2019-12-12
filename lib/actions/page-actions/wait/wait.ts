import * as puppeteer from 'puppeteer-core';

export async function wait(
  durationInMilliseconds: number,
  page: puppeteer.Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(`Error: cannot wait because a new page has not been created`);
  }

  await page.waitFor(durationInMilliseconds);
}
