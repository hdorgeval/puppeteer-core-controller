import * as puppeteer from 'puppeteer-core';
import { waitUntilSelectorIsVisible, ClickOptions, waitUntilSelectorDoesNotMove } from '.';

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

  await waitUntilSelectorDoesNotMove(
    selector,
    {
      timeoutInMilliseconds: options.timeoutInMilliseconds,
    },
    page,
  );

  await page.click(selector, puppeteerClickOptions);
}
