import * as puppeteer from 'puppeteer-core';

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
    throw new Error(`Cannot click on '${selector}' because a new page has not been created`);
  }
  const puppeteerClickOptions = {
    button: options.button,
    delay: options.delay,
    clickCount: options.clickCount,
  };

  await page.waitForSelector(selector, {
    hidden: false,
    visible: true,
    timeout: options.timeoutInMilliseconds,
  });
  await page.click(selector, puppeteerClickOptions);
}
