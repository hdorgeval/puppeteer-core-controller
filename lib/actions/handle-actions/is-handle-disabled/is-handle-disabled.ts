import * as puppeteer from 'puppeteer-core';
export async function isHandleDisabled(
  selector: puppeteer.ElementHandle<Element> | undefined | null,
): Promise<boolean> {
  if (selector === undefined || selector === null) {
    return false;
  }

  const result = await selector.evaluate((el): boolean => {
    const inputElement = el as HTMLInputElement;
    if (inputElement && inputElement.disabled !== undefined) {
      return inputElement.disabled;
    }
    return false;
  });

  return result;
}
