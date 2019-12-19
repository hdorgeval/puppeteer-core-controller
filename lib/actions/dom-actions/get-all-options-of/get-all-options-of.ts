import * as puppeteer from 'puppeteer-core';
export interface SelectOptionInfo {
  value: string;
  label: string;
  selected: boolean;
}
export async function getAllOptionsOf(
  selector: string,
  page: puppeteer.Page | undefined,
): Promise<SelectOptionInfo[]> {
  if (!page) {
    throw new Error(
      `Error: cannot get the options of '${selector}' because a new page has not been created`,
    );
  }

  const result = await page.$eval(selector, (el: Element): string | null => {
    const selectElement = el as HTMLSelectElement;
    if (!selectElement) {
      return null;
    }
    if (!selectElement.options) {
      return null;
    }
    const options = Array.from(selectElement.options);
    const infos = options.map((option: HTMLOptionElement) => {
      return {
        value: option.value,
        label: option.label,
        selected: option.selected,
      };
    });
    return JSON.stringify(infos);
  });

  if (result === null) {
    throw new Error(`Cannot find any options in selector '${selector}'`);
  }

  const optionsInfos = JSON.parse(result) as SelectOptionInfo[];
  return optionsInfos;
}
