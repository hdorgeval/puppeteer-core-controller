import * as puppeteer from 'puppeteer-core';
declare const window: Window;
export async function hasFocus(
  selector: string,
  page: puppeteer.Page | undefined,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot check that '${selector}' has focus because a new page has not been created`,
    );
  }

  const result = await page.$eval(selector, (el: Element): boolean => {
    const focusedElement = window.document.activeElement;
    if (!focusedElement) {
      return false;
    }
    if (focusedElement.tagName !== el.tagName) {
      return false;
    }
    return focusedElement.isSameNode(el);
  });

  return result;
}
