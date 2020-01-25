import * as puppeteer from 'puppeteer-core';

export async function getParentsOf(
  elements: puppeteer.ElementHandle<Element>[],
): Promise<puppeteer.ElementHandle<Element>[]> {
  const result: puppeteer.ElementHandle<Element>[] = [];

  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];

    const jsHandle: puppeteer.JSHandle<Element> = await element.evaluateHandle((node) => {
      const parentNode = node.parentElement;
      return parentNode;
    }, element);

    if (jsHandle) {
      const parentElement = jsHandle.asElement();
      parentElement && result.push(parentElement);
    }
  }

  return result;
}
