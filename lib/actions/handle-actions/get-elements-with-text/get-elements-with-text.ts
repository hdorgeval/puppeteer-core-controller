import * as puppeteer from 'puppeteer-core';

export async function getElementsWithText(
  text: string,
  elements: puppeteer.ElementHandle<Element>[],
): Promise<puppeteer.ElementHandle<Element>[]> {
  const result: puppeteer.ElementHandle<Element>[] = [];

  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];

    const innerText = await element.evaluate((node) => {
      const nodeWithText = node as HTMLElement;
      if (nodeWithText && nodeWithText.innerText) {
        return nodeWithText.innerText;
      }

      return undefined;
    });
    if (innerText && innerText.includes(text)) {
      result.push(element);
    }
  }

  return result;
}
