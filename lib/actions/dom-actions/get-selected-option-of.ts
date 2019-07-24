import * as puppeteer from 'puppeteer-core';

export async function getSelectedOptionOf(
  selector: string,
  page: puppeteer.Page | undefined,
): Promise<string | null> {
  if (!page) {
    throw new Error(
      `Error: cannot get the selected option of '${selector}' because a new page has not been created`,
    );
  }

  const result = await page.$eval(selector, (el: Element): string | null => {
    const selectElement = el as HTMLSelectElement;
    if (!selectElement) {
      return null;
    }
    if (!selectElement.selectedOptions) {
      return null;
    }
    const selectedOptions = Array.from(selectElement.selectedOptions);
    if (selectedOptions.length === 0) {
      return null;
    }
    return selectedOptions[0].innerText;
  });

  return result;
}
