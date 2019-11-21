import * as puppeteer from 'puppeteer-core';
import { waitUntilSelectorWithTextIsVisible } from './wait-until-selector-with-text-is-visible';
import { querySelectorWithText } from '../dom-actions';
import { ClickOptions } from '.';

export async function clickOnSelectorWithText(
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

  await waitUntilSelectorWithTextIsVisible(
    selector,
    text,
    { timeoutInMilliseconds: options.timeoutInMilliseconds },
    page,
  );

  const element = await querySelectorWithText(selector, text, page);

  await element.click(puppeteerClickOptions);
}
