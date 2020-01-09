import * as puppeteer from 'puppeteer-core';

export async function scrollTo(selector: string, page: puppeteer.Page | undefined): Promise<void> {
  if (!page) {
    throw new Error(
      `Error: cannot scroll to '${selector}' because a new page has not been created`,
    );
  }

  await page.$eval(selector, (el: Element): void => {
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  });
}
