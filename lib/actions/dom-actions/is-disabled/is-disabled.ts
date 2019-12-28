import * as puppeteer from 'puppeteer-core';

export async function isDisabled(
  selector: string,
  page: puppeteer.Page | undefined,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Error: cannot get the disabled property of '${selector}' because a new page has not been created`,
    );
  }

  const result = await page.$eval(selector, (el: HTMLInputElement | Element): boolean => {
    const inputElement = el as HTMLInputElement;
    if (inputElement && inputElement.disabled !== undefined) {
      return inputElement.disabled;
    }
    return false;
  });

  return result;
}
