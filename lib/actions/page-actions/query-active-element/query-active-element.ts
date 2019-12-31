import * as puppeteer from 'puppeteer-core';
import { hasActiveElement } from '../../dom-actions';
declare const window: Window;

export async function queryActiveElement(
  page: puppeteer.Page | undefined,
): Promise<puppeteer.ElementHandle<Element> | null> {
  if (!page) {
    throw new Error(`Error: cannot query active element because a new page has not been created`);
  }

  const hasActiveElementInPage = await hasActiveElement(page);
  if (!hasActiveElementInPage) {
    return null;
  }

  const activeElement = await page.evaluateHandle(() => window.document.activeElement);
  return activeElement.asElement();
}
