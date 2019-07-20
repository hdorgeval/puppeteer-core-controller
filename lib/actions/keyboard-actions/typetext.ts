import * as puppeteer from 'puppeteer-core';

export interface TypeTextOptions {
  delay?: number;
}

export const defaultTypeTextOptions: TypeTextOptions = {
  delay: 50,
};
export async function typeText(
  text: string,
  options: TypeTextOptions,
  page: puppeteer.Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot type text because a new page has not been created`);
  }
  const puppeteerTypeTextOptions = {
    ...options,
  };
  await page.keyboard.type(text, puppeteerTypeTextOptions);
}
