import * as puppeteer from 'puppeteer-core';
import { getValueOfHandle } from '../get-value-of-handle';
export async function hasHandleValue(
  selector: puppeteer.ElementHandle<Element> | undefined | null,
  expectedValue: string,
): Promise<boolean> {
  const value = await getValueOfHandle(selector);

  if (value === undefined && expectedValue === '') {
    return true;
  }

  if (value === null && expectedValue === '') {
    return true;
  }

  if (value === undefined || value === null) {
    return false;
  }

  if (value === '' && expectedValue === '') {
    return true;
  }

  if (expectedValue === '') {
    return false;
  }

  if (value.includes(expectedValue)) {
    return true;
  }

  return false;
}
