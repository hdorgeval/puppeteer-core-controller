import * as puppeteer from 'puppeteer-core';
import { hasAttribute } from '../has-attribute';

export async function hasAttributeWithValue(
  selector: string,
  attributeName: string,
  expectedValue: string,
  page: puppeteer.Page | undefined,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Error: cannot get attribute '${attributeName}' of '${selector}' because a new page has not been created`,
    );
  }

  const atrributeExists = await hasAttribute(selector, attributeName, page);
  if (!atrributeExists) {
    return false;
  }

  const attributeValue = await page.$eval(
    selector,
    (el: Element, attr: string): string => {
      const value = el.getAttribute(attr);
      if (value === null) {
        return 'null';
      }
      return value;
    },
    attributeName,
  );

  return attributeValue === expectedValue;
}
