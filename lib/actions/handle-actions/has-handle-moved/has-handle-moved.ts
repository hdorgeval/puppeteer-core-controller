import * as puppeteer from 'puppeteer-core';
import { getDistanceBetweenClientRectangles } from '../../../utils';
import { getClientRectangleOfHandle } from '..';

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

  return distance >= threshold;
}
