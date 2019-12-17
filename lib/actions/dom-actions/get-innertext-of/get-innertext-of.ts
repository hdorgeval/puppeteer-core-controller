import * as puppeteer from 'puppeteer-core';

export async function getInnerTextOf(
  selector: string,
  page: puppeteer.Page | undefined,
): Promise<string> {
  if (!page) {
    throw new Error(
      `Error: cannot get the innerText of '${selector}' because a new page has not been created`,
    );
  }

  const result = await page.$eval(selector, (el: HTMLElement | Element): string => {
    const htmlElement = el as HTMLElement;
    return htmlElement && htmlElement.innerText;
  });

  return result;
}
