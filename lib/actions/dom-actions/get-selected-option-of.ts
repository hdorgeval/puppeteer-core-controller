import * as puppeteer from 'puppeteer-core';
import { SelectOptionInfo } from '.';

export async function getSelectedOptionOf(
  selector: string,
  page: puppeteer.Page | undefined,
): Promise<SelectOptionInfo | null> {
  if (!page) {
    throw new Error(
      `Error: cannot get the selected option of '${selector}' because a new page has not been created`,
    );
  }

  const stringifiedResult = await page.$eval(selector, (el: Element): string | null => {
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
    const optionInfo: SelectOptionInfo = {
      label: selectedOptions[0].label,
      selected: true,
      value: selectedOptions[0].value,
    };
    return JSON.stringify(optionInfo);
  });

  const result = stringifiedResult === null ? null : JSON.parse(stringifiedResult);
  return result;
}
