import * as puppeteer from 'puppeteer-core';

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

  await page.waitForSelector(selector, {
    hidden: false,
    visible: true,
    timeout: options.timeoutInMilliseconds,
  });
  await page.select(selector, ...values);
}
