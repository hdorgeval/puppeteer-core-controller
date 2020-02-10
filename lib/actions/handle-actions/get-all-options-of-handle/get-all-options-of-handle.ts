import * as puppeteer from 'puppeteer-core';
import { SelectOptionInfo } from '../../dom-actions';

export async function getAllOptionsOfHandle(
  selector: puppeteer.ElementHandle<Element> | undefined | null,
): Promise<SelectOptionInfo[]> {
  if (selector === undefined || selector === null) {
    return [];
  }

  const result = await selector.evaluate((el: Element): string | null => {
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
    return [];
  }

  const optionsInfos = JSON.parse(result) as SelectOptionInfo[];
  return optionsInfos;
}
