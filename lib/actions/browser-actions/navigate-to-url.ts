import * as puppeteer from 'puppeteer-core';

export const defaultNavigationOptions: puppeteer.NavigationOptions = {
  timeout: 30000,
};
export async function navigateTo(
  url: string,
  options: puppeteer.NavigationOptions,
  page: puppeteer.Page | undefined,
): Promise<void> {
  if (page) {
    await page.goto(url, options);
    return;
  }
  throw new Error(`Error: cannot navigate to '${url}' because a new page has not been created`);
}
