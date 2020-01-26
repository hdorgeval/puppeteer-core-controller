import * as puppeteer from 'puppeteer-core';
import { getClientRectangleOfHandle, hasHandleMoved } from '..';
import { sleep } from '../../../utils';

export async function isHandleMoving(
  selector: puppeteer.ElementHandle<Element> | null | undefined,
): Promise<boolean> {
  if (!selector) {
    return false;
  }

  const previousClientRectangle = await getClientRectangleOfHandle(selector);

  await sleep(50);

  const result = await hasHandleMoved(selector, previousClientRectangle);
  return result;
}
