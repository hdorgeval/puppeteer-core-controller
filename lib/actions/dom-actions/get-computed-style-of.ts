import * as puppeteer from 'puppeteer-core';
declare const window: Window;

export async function getComputedStyleOf(
  selector: string,
  page: puppeteer.Page | undefined,
): Promise<CSSStyleDeclaration> {
  if (!page) {
    throw new Error(
      `Error: cannot get the computed style of '${selector}' because a new page has not been created`,
    );
  }

  const stringifiedResult = await page.$eval(selector, (el: Element): string => {
    const computedStyles = window.getComputedStyle(el);
    return JSON.stringify(computedStyles);
  });

  const computedStyles = JSON.parse(stringifiedResult);
  return Promise.resolve(computedStyles);
}
