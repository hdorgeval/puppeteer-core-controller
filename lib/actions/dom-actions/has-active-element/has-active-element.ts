import * as puppeteer from 'puppeteer-core';
declare const window: Window;
export async function hasActiveElement(page: puppeteer.Page | undefined): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Error: cannot check that page has an active element because a new page has not been created`,
    );
  }

  const result = await page.$eval('html > body', (el: Element): boolean => {
    const focusedElement = window.document.activeElement;
    if (!focusedElement) {
      return false;
    }
    if (focusedElement.tagName === el.tagName) {
      return false;
    }
    return true;
  });

  return result;
}
