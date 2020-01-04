import * as puppeteer from 'puppeteer-core';
import { getClientRectangleOf } from '../get-client-rectangle-of';
import { getDistanceBetweenClientRectangles } from '../../../utils';

export const zeroClientRectangle: ClientRect = {
  top: 0,
  left: 0,
  width: 1,
  height: 1,
  bottom: 0,
  right: 0,
};

export async function hasMoved(
  selector: string,
  previousClientRectangle: ClientRect,
  page: puppeteer.Page | undefined,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Error: cannot check that '${selector}' has moved because a new page has not been created`,
    );
  }

  const currentClientRectangle = await getClientRectangleOf(selector, page);

  const threshold = 5;
  const distance = getDistanceBetweenClientRectangles(
    currentClientRectangle,
    previousClientRectangle,
  );

  return distance >= threshold;
}
