import * as puppeteer from 'puppeteer-core';

export const mandatoryFullPageScreenshotOptions: puppeteer.ScreenshotOptions = {
  fullPage: true,
  encoding: 'base64',
};
export async function takeFullPageScreenshotAsBase64(
  options: puppeteer.ScreenshotOptions,
  page: puppeteer.Page | undefined,
): Promise<string> {
  if (!page) {
    throw new Error(
      `Error: cannot take a screenshot of the full page because page has not been created`,
    );
  }

  const puppeteerScreenshotOptions: puppeteer.ScreenshotOptions = {
    ...options,
    ...mandatoryFullPageScreenshotOptions,
  };

  const result = (await page.screenshot(puppeteerScreenshotOptions)) as string;
  return result;
}
