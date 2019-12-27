import * as puppeteer from 'puppeteer-core';
import { waitUntilSelectorIsVisible, waitUntilSelectorDoesNotMove } from '.';
import { getAllOptionsOf } from '../dom-actions';

export interface SelectOptions {
  timeoutInMilliseconds: number;
}
export const defaultSelectOptions: SelectOptions = {
  timeoutInMilliseconds: 30000,
};
export async function select(
  selector: string,
  values: string[],
  options: SelectOptions,
  page: puppeteer.Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(
      `Error: cannot select option(s) '${values}' in '${selector}' because a new page has not been created`,
    );
  }

  await waitUntilSelectorIsVisible(
    selector,
    { timeoutInMilliseconds: options.timeoutInMilliseconds },
    page,
  );

  await waitUntilSelectorDoesNotMove(
    selector,
    {
      timeoutInMilliseconds: options.timeoutInMilliseconds,
    },
    page,
  );

  const availableOptions = await getAllOptionsOf(selector, page);
  const tobeSelectedOptions = [...values];

  const canSelect = tobeSelectedOptions.every((tobeSelectedOption) => {
    const match = availableOptions.find(
      (availableOption) => availableOption.label === tobeSelectedOption,
    );
    if (match === undefined) {
      return false;
    }
    return true;
  });

  if (!canSelect) {
    throw new Error(
      `Cannot select '${tobeSelectedOptions.join(
        ',',
      )}' in list '${selector}' because it does not match available options: '${availableOptions
        .map((o) => o.label)
        .join(',')}'`,
    );
  }

  const optionValues = values.map((value) => {
    const match = availableOptions.find((availableOption) => availableOption.label === value);
    if (match === undefined) {
      return value;
    }
    return match.value;
  });

  await page.select(selector, ...optionValues);
}
