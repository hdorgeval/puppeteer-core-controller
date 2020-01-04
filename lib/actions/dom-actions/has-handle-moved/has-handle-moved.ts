import * as puppeteer from 'puppeteer-core';
import { getClientRectangleOfHandle } from '..';
import { getDistanceBetweenClientRectangles } from '../../../utils';

export async function hasHandleMoved(
  selector: puppeteer.ElementHandle<Element> | null | undefined,
  previousClientRectangle: ClientRect,
): Promise<boolean> {
  const currentClientRectangle = await getClientRectangleOfHandle(selector);

  if (currentClientRectangle === null) {
    return false;
  }

  const threshold = 5;
  const distance = getDistanceBetweenClientRectangles(
    currentClientRectangle,
    previousClientRectangle,
  );

  // eslint-disable-next-line no-console
  console.log(`distance= ${distance}`);
  return distance >= threshold;
}
