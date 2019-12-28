import * as puppeteer from 'puppeteer-core';

export async function isChecked(
  selector: string,
  page: puppeteer.Page | undefined,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Error: cannot get the checked property of '${selector}' because a new page has not been created`,
    );
  }

  const result = await page.$eval(selector, (el: HTMLInputElement | Element): boolean => {
    const inputElement = el as HTMLInputElement;
    if (inputElement && inputElement.checked !== undefined) {
      return inputElement.checked;
    }
    return false;
  });

  return result;
}
