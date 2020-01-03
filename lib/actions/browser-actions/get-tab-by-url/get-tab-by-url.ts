import * as puppeteer from 'puppeteer-core';
import { getCurrentUrl } from '../get-current-url';
export async function getTabByUrl(
  browser: puppeteer.Browser | undefined,
  url: string,
): Promise<puppeteer.Page> {
  if (!browser) {
    throw new Error('Error: cannot get an existing page because the browser has not been launched');
  }

  const pages = await browser.pages();
  const foundPages: puppeteer.Page[] = [];
  for (let index = 0; index < pages.length; index++) {
    const page = pages[index];
    const currentUrl = await getCurrentUrl(page);
    if (currentUrl && currentUrl.includes(url)) {
      foundPages.push(page);
    }
  }

  if (foundPages.length > 0) {
    return foundPages[0];
  }

  throw new Error(`Error: cannot find page with url '${url}' on current browser instance`);
}
