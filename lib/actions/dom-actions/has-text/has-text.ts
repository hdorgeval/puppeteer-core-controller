import * as puppeteer from 'puppeteer-core';
import { getInnerTextOf } from '../index';
export async function hasText(
  selector: string,
  expectedText: string,
  page: puppeteer.Page | undefined,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Error: cannot check that '${selector}' has text '${expectedText}' because a new page has not been created`,
    );
  }

  const innerText = await getInnerTextOf(selector, page);

  if (innerText.includes(expectedText)) {
    return true;
  }

  return false;
}
