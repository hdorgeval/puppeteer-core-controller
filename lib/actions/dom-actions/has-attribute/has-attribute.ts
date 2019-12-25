import * as puppeteer from 'puppeteer-core';
export async function hasAttribute(
  selector: string,
  attributeName: string,
  page: puppeteer.Page | undefined,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Error: cannot get attribute '${attributeName}' of '${selector}' because a new page has not been created`,
    );
  }

  const hasAttribute = await page.$eval(
    selector,
    (el: Element, attr: string): string => {
      const value = el.getAttribute(attr);
      if (value === null) {
        return 'false';
      }
      return 'true';
    },
    attributeName,
  );

  const result = hasAttribute === 'true' ? true : false;
  return result;
}
