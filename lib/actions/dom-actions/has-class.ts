import * as puppeteer from 'puppeteer-core';
export async function hasClass(
  selector: string,
  className: string,
  page: puppeteer.Page | undefined,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Error: cannot get class list of '${selector}', because a new page has not been created`,
    );
  }

  const stringifiedClassList = await page.$eval(selector, (el: Element): string => {
    const classList = Array.from(el.classList);
    return JSON.stringify(classList);
  });

  const classList: string[] = JSON.parse(stringifiedClassList);
  if (!Array.isArray(classList)) {
    return false;
  }
  // prettier-ignore
  const hasClass = classList
    .filter((c: string): boolean => c === className)
    .length > 0;

  return hasClass;
}
