import * as puppeteer from 'puppeteer-core';

export interface KeyboardPressOptions {
  delay?: number;
}

export type KeyboardKey = 'Tab' | 'Backspace' | 'Enter';

export const defaultKeyboardPressOptions: KeyboardPressOptions = {
  delay: 50,
};
export async function pressKey(
  key: KeyboardKey,
  options: KeyboardPressOptions,
  page: puppeteer.Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(`Error: cannot press key '${key}' because a new page has not been created`);
  }
  const puppeteerKeyboardPressOptions = {
    ...options,
  };
  await page.keyboard.press(key, puppeteerKeyboardPressOptions);
}
