import * as puppeteer from 'puppeteer-core';

export async function querySelectorWithText(
  selector: string,
  text: string,
  page: puppeteer.Page | undefined,
): Promise<puppeteer.ElementHandle<Element>> {
  if (!page) {
    throw new Error(
      `Error: cannot query selector '${selector}' with text '${text}' because a new page has not been created`,
    );
  }

  const elements = await page.$$(selector);

  if (elements.length === 0) {
    throw new Error(`Error: Cannot find selector '${selector}'`);
  }

  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];
    const innerText = await element.evaluate((node): string | undefined => {
      const nodeWithText = node as HTMLElement;
      if (nodeWithText && nodeWithText.innerText) {
        return nodeWithText.innerText;
      }

      return undefined;
    });

    if (innerText && innerText.includes(text)) {
      return element;
    }
  }
  throw new Error(`Error: Cannot find a selector '${selector}' with text '${text}'`);
}
