import * as puppeteer from 'puppeteer-core';
import { ClickOptions } from '../';

export async function clear(
  selector: string,
  options: ClickOptions,
  page: puppeteer.Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(`Error: cannot clear '${selector}' because a new page has not been created`);
  }
  const puppeteerClickOptions: puppeteer.ClickOptions = {
    button: 'left',
    delay: options.delay,
    clickCount: 3,
  };

  await page.click(selector, puppeteerClickOptions);
  await page.waitFor(1000);
  await page.keyboard.press('Backspace', { delay: options.delay });
}
