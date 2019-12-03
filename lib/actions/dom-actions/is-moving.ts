import * as puppeteer from 'puppeteer-core';
import { getClientRectangleOf } from './get-client-rectangle-of';
import { hasMoved } from './has-moved';

export async function isMoving(
  selector: string,
  page: puppeteer.Page | undefined,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Error: cannot check that '${selector}' is moving because a new page has not been created`,
    );
  }

  const previousClientRectangle = await getClientRectangleOf(selector, page);
  await page.waitFor(50);
  const result = await hasMoved(selector, previousClientRectangle, page);
  return result;
}
