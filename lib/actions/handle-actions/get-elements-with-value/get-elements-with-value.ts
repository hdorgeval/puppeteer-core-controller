import * as puppeteer from 'puppeteer-core';
import { hasHandleValue } from '../has-handle-value';

export async function getElementsWithValue(
  text: string,
  elements: puppeteer.ElementHandle<Element>[],
): Promise<puppeteer.ElementHandle<Element>[]> {
  const result: puppeteer.ElementHandle<Element>[] = [];

  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];

    const hasValue = await hasHandleValue(element, text);
    if (hasValue) {
      result.push(element);
    }
  }

  return result;
}
