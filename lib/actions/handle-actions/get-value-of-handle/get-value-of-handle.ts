import * as puppeteer from 'puppeteer-core';

export async function getValueOfHandle(
  selector: puppeteer.ElementHandle<Element> | null | undefined,
): Promise<string | undefined | null> {
  if (!selector) {
    return null;
  }

  const result = await selector.evaluate((el: HTMLInputElement | Element): string => {
    const inputElement = el as HTMLInputElement;
    return inputElement && inputElement.value;
  });

  return result;
}
