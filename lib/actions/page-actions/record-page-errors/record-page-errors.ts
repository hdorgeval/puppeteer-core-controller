import * as puppeteer from 'puppeteer-core';

export async function recordPageErrors(
  page: puppeteer.Page | undefined,
  callback: (error: Error) => void,
): Promise<void> {
  if (!page) {
    throw new Error(`Error: cannot record page errors because a new page has not been created`);
  }

  page.on('pageerror', (err) => {
    callback(err);
  });
}
