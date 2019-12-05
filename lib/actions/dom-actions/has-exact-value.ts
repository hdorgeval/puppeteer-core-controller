import * as puppeteer from 'puppeteer-core';
import { getValueOf } from './index';
export async function hasExactValue(
  selector: string,
  expectedValue: string,
  page: puppeteer.Page | undefined,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Error: cannot check that '${selector}' has value '${expectedValue}' because a new page has not been created`,
    );
  }

  const value = await getValueOf(selector, page);

  if (value === undefined) {
    throw new Error(`Error: Selector '${selector}' has no value property`);
  }

  if (value.trim() === expectedValue) {
    return true;
  }

  return false;
}
