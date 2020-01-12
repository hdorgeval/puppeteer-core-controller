import * as puppeteer from 'puppeteer-core';
import { getAllOptionsOf } from '../get-all-options-of';

export async function isOptionAvailableIn(
  selector: string,
  expectedOptionLabel: string,
  page: puppeteer.Page | undefined,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Error: cannot check if option '${expectedOptionLabel}' is available in '${selector}' because a new page has not been created`,
    );
  }

  const availableOptions = await getAllOptionsOf(selector, page);
  const foundOption = availableOptions
    .filter((option) => option.label === expectedOptionLabel)
    .shift();

  if (foundOption) {
    return true;
  }
  return false;
}
