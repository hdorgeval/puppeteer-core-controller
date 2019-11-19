import * as puppeteer from 'puppeteer-core';

export interface WaitOptions {
  timeoutInMilliseconds: number;
}
export const defaultWaitOptions: WaitOptions = {
  timeoutInMilliseconds: 30000,
};
export async function waitUntilSelectorIsVisible(
  selector: string,
  options: WaitOptions,
  page: puppeteer.Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(
      `Error: cannot wait for selector '${selector}' to be visible because a new page has not been created`,
    );
  }

  await page.waitForSelector(selector, {
    hidden: false,
    visible: true,
    timeout: options.timeoutInMilliseconds,
  });
}
