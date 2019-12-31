import * as puppeteer from 'puppeteer-core';
import { WaitOptions } from '..';
import { isMoving } from '../../dom-actions';

export async function waitUntilSelectorDoesNotMove(
  selector: string,
  options: WaitOptions,
  page: puppeteer.Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(
      `Error: cannot wait for selector '${selector}' to not move because a new page has not been created`,
    );
  }

  const waitIntervalForIsMovingFunc = 50;
  const waitInterval = 10;
  let elapsedTime = 0;
  let stabilityCounter = 0;
  const maxStabilityCounter = 7;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (elapsedTime > options.timeoutInMilliseconds) {
      throw new Error(
        `Error: Selector '${selector}' is still moving after ${options.timeoutInMilliseconds} ms`,
      );
    }
    if (stabilityCounter >= maxStabilityCounter) {
      return;
    }

    const isCurrentlyMoving = await isMoving(selector, page);
    if (isCurrentlyMoving) {
      await page.waitFor(waitInterval);
      stabilityCounter = 0;
      elapsedTime += waitIntervalForIsMovingFunc + waitInterval;
      continue;
    }

    stabilityCounter += 1;
    elapsedTime += waitIntervalForIsMovingFunc;
  }
}
