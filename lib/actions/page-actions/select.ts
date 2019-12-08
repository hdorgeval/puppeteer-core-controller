import * as puppeteer from 'puppeteer-core';
import { waitUntilSelectorIsVisible, waitUntilSelectorDoesNotMove } from '.';

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

  const selectedOptions = await page.select(selector, ...values);

  if (Array.isArray(selectedOptions) && selectedOptions.length === 0) {
    throw new Error(`Error: cannot select '${values.join(',')}' in list '${selector}'`);
  }
}
