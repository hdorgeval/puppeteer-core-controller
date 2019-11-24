import * as puppeteer from 'puppeteer-core';
import { querySelectorWithExactText } from '../dom-actions';
import { ClickOptions, waitUntilSelectorWithExactTextIsVisible } from '.';

export async function clickOnSelectorWithExactText(
  selector: string,
  text: string,
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

  await waitUntilSelectorWithExactTextIsVisible(
    selector,
    text,
    { timeoutInMilliseconds: options.timeoutInMilliseconds },
    page,
  );

  const element = await querySelectorWithExactText(selector, text, page);
  await element.hover();
  await element.click(puppeteerClickOptions);
}
