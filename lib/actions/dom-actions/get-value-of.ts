import * as puppeteer from 'puppeteer-core';

export async function getValueOf(
  selector: string,
  page: puppeteer.Page | undefined,
): Promise<string> {
  if (!page) {
    throw new Error(
      `Error: cannot get the value of '${selector}' because a new page has not been created`,
    );
  }

  const result = await page.$eval(selector, (el: HTMLInputElement | Element): string => {
    const inputElement = el as HTMLInputElement;
    return inputElement && inputElement.value;
  });

  return result;
}
