import * as puppeteer from 'puppeteer-core';
import { getClientRectangleOf } from '../dom-actions';
import { waitUntilSelectorIsVisible } from '.';

export interface HoverOptions {
  timeoutInMilliseconds: number;
  steps: number;
}
export const defaultHoverOptions: HoverOptions = {
  timeoutInMilliseconds: 30000,
  steps: 10,
};
export async function hover(
  selector: string,
  options: HoverOptions,
  page: puppeteer.Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(`Error: cannot hover to '${selector}' because a new page has not been created`);
  }

  await waitUntilSelectorIsVisible(
    selector,
    { timeoutInMilliseconds: options.timeoutInMilliseconds },
    page,
  );

  const clientRectangle = await getClientRectangleOf(selector, page);
  const x = clientRectangle.left + clientRectangle.width / 2;
  const y = clientRectangle.top + clientRectangle.height / 2;
  await page.mouse.move(x, y, { steps: options.steps });
}
