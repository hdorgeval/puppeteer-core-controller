import * as puppeteer from 'puppeteer-core';

export async function getClassListOf(
  selector: string,
  page: puppeteer.Page | undefined,
): Promise<string[]> {
  if (!page) {
    throw new Error(
      `Error: cannot get the class list of '${selector}' because a new page has not been created`,
    );
  }

  const stringifiedClassList = await page.$eval(selector, (el: Element): string => {
    const classList = Array.from(el.classList);
    return JSON.stringify(classList);
  });

  const result: string[] = JSON.parse(stringifiedClassList);
  return result;
}
