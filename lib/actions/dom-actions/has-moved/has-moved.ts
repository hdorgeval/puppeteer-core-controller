import * as puppeteer from 'puppeteer-core';
import { getClientRectangleOf } from '../get-client-rectangle-of';

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
  const x = currentClientRectangle.left + currentClientRectangle.width / 2;
  const y = currentClientRectangle.top + currentClientRectangle.height / 2;
  const currentPosition = Math.sqrt(x * x + y * y);

  const previousX = previousClientRectangle.left + previousClientRectangle.width / 2;
  const previousY = previousClientRectangle.top + previousClientRectangle.height / 2;
  const previousPosition = Math.sqrt(previousX * previousX + previousY * previousY);

  const threshold = 5;
  const distance = Math.abs(currentPosition - previousPosition);

  return distance >= threshold;
}
