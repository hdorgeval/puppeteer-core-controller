import * as puppeteer from 'puppeteer-core';
import { waitUntilSelectorIsVisible } from '.';

export interface ClickOptions extends puppeteer.ClickOptions {
  timeoutInMilliseconds: number;
}

export const defaultClickOptions: ClickOptions = {
  timeoutInMilliseconds: 30000,
  delay: 100,
  button: 'left',
  clickCount: 1,
};
export async function click(
  selector: string,
  options: ClickOptions,
  page: puppeteer.Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(`Error: cannot click on '${selector}' because a new page has not been created`);
  }
  const puppeteerClickOptions = {
    button: options.button,
    delay: options.delay,
    clickCount: options.clickCount,
  };

  await waitUntilSelectorIsVisible(
    selector,
    { timeoutInMilliseconds: options.timeoutInMilliseconds },
    page,
  );

  await page.click(selector, puppeteerClickOptions);
}
