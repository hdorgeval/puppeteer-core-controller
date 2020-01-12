import * as puppeteer from 'puppeteer-core';
import { WaitOptions } from '..';
import { areOptionsAvailableIn } from '../../dom-actions';

export async function waitUntilOptionsAreAvailable(
  selector: string,
  expectedOptionLabels: string[],
  options: WaitOptions,
  page: puppeteer.Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(
      `Error: cannot check if option(s) [${expectedOptionLabels.join(
        ',',
      )}] is available in '${selector}' because a new page has not been created`,
    );
  }

  const waitInterval = 10;
  let elapsedTime = 0;
  let stabilityCounter = 0;
  const maxStabilityCounter = 7;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (elapsedTime > options.timeoutInMilliseconds) {
      throw new Error(
        `Error: option(s) [${expectedOptionLabels.join(
          ',',
        )}] is still missing in '${selector}' after ${options.timeoutInMilliseconds} ms`,
      );
    }

    if (stabilityCounter >= maxStabilityCounter) {
      return;
    }

    await page.waitFor(waitInterval);
    elapsedTime += waitInterval;
    const areOptionsAvailable = await areOptionsAvailableIn(selector, expectedOptionLabels, page);

    if (areOptionsAvailable) {
      stabilityCounter += 1;
      continue;
    }

    stabilityCounter = 0;
  }
}
