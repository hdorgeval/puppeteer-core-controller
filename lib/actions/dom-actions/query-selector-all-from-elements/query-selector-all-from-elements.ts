import * as puppeteer from 'puppeteer-core';

export async function querySelectorAllFromElements(
  selector: string,
  rootElements: puppeteer.ElementHandle<Element>[],
  page: puppeteer.Page | undefined,
): Promise<puppeteer.ElementHandle<Element>[]> {
  if (!page) {
    throw new Error(
      `Error: cannot query selector '${selector}' because a new page has not been created`,
    );
  }

  const result: puppeteer.ElementHandle<Element>[] = [];

  for (let index = 0; index < rootElements.length; index++) {
    const rootElement = rootElements[index];
    const foundElements = await rootElement.$$(selector);
    result.push(...foundElements);
  }

  return result;
}
