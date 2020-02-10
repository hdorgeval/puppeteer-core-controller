import * as puppeteer from 'puppeteer-core';
import { getAllOptionsOfHandle } from '..';

export async function isOptionAvailableInHandle(
  selector: puppeteer.ElementHandle<Element> | undefined | null,
  expectedOptionLabel: string,
): Promise<boolean> {
  if (selector === undefined || selector === null) {
    return false;
  }

  const availableOptions = await getAllOptionsOfHandle(selector);
  const foundOption = availableOptions
    .filter((option) => option.label === expectedOptionLabel)
    .shift();

  if (foundOption) {
    return true;
  }
  return false;
}
