import * as puppeteer from 'puppeteer-core';
import { isHandleMoving } from '..';
import { WaitOptions } from '../../page-actions';
import { sleep } from '../../../utils';

export async function waitUntilHandleDoesNotMove(
  selector: puppeteer.ElementHandle<Element> | null | undefined,
  selectorName: string,
  options: WaitOptions,
): Promise<void> {
  if (!selector) {
    return;
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
        `Error: Selector '${selectorName}' is still moving after ${options.timeoutInMilliseconds} ms`,
      );
    }
    if (stabilityCounter >= maxStabilityCounter) {
      return;
    }

    const isCurrentlyMoving = await isHandleMoving(selector);
    if (isCurrentlyMoving) {
      await sleep(waitInterval);
      stabilityCounter = 0;
      elapsedTime += waitIntervalForIsMovingFunc + waitInterval;
      continue;
    }

    stabilityCounter += 1;
    elapsedTime += waitIntervalForIsMovingFunc;
  }
}
