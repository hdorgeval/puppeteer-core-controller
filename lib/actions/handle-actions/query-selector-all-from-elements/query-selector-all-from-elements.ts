import * as puppeteer from 'puppeteer-core';

export async function querySelectorAllFromElements(
  selector: string,
  rootElements: puppeteer.ElementHandle<Element>[],
): Promise<puppeteer.ElementHandle<Element>[]> {
  const result: puppeteer.ElementHandle<Element>[] = [];

  for (let index = 0; index < rootElements.length; index++) {
    const rootElement = rootElements[index];
    const foundElements = await rootElement.$$(selector);
    result.push(...foundElements);
  }

  return result;
}
