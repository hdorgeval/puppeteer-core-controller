import * as puppeteer from 'puppeteer-core';
import { isOptionAvailableIn } from '../is-option-available-in';

export async function areOptionsAvailableIn(
  selector: string,
  expectedOptionLabels: string[],
  page: puppeteer.Page | undefined,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Error: cannot check if options [${expectedOptionLabels.join(
        ',',
      )}] are available in '${selector}' because a new page has not been created`,
    );
  }

  if (expectedOptionLabels.length === 0) {
    throw new Error('No option to check: you must specify at least one option');
  }

  for (let index = 0; index < expectedOptionLabels.length; index++) {
    const expectedOptionLabel = expectedOptionLabels[index];
    const isAvailable = await isOptionAvailableIn(selector, expectedOptionLabel, page);
    if (!isAvailable) {
      return false;
    }
  }

  return true;
}
