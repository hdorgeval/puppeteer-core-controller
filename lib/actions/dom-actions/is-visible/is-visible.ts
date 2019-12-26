import * as puppeteer from 'puppeteer-core';
import { exists } from '../index';
declare const window: Window;
export async function isVisible(
  selector: string,
  page: puppeteer.Page | undefined,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Error: cannot check if '${selector}' is visible because a new page has not been created`,
    );
  }

  const elementExists = await exists(selector, page);
  if (!elementExists) {
    return false;
  }

  try {
    const result = await page.$eval(selector, (el: Element): boolean => {
      function hasVisibleBoundingBox(element: Element): boolean {
        const rect = element.getBoundingClientRect();
        return !!(rect.top || rect.bottom || rect.width || rect.height);
      }

      const style = window.getComputedStyle(el);

      if (style && style.opacity && style.opacity === '0') {
        return false;
      }

      const isVisible = style && style.visibility !== 'hidden' && hasVisibleBoundingBox(el);
      return isVisible;
    });

    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `An internal error has occured in Puppeteer API while checking if selector '${selector}'  is visible`,
      error,
    );
    return false;
  }
}
