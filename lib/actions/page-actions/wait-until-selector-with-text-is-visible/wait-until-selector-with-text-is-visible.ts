import * as puppeteer from 'puppeteer-core';
import { WaitOptions } from '..';
declare const document: Document;

export async function waitUntilSelectorWithTextIsVisible(
  selector: string,
  text: string,
  options: WaitOptions,
  page: puppeteer.Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(
      `Error: cannot wait for selector '${selector}' to be visible because a new page has not been created`,
    );
  }

  try {
    await page.waitFor(
      ({ selector, text }) => {
        const elements = Array.from(document.querySelectorAll(selector));
        if (elements.length === 0) {
          return false;
        }
        const foundElements = elements.filter((element) => {
          const htmlElement = element as HTMLElement;
          if (htmlElement && htmlElement.innerText && htmlElement.innerText.includes(text)) {
            return true;
          }
          return false;
        });

        if (foundElements.length > 0) {
          return true;
        }

        return false;
      },
      {
        hidden: false,
        visible: true,
        timeout: options.timeoutInMilliseconds,
      },
      { selector, text },
    );
  } catch (error) {
    if (
      error &&
      error.message &&
      typeof error.message === 'string' &&
      error.message.includes('timeout')
    ) {
      throw new Error(
        `Error: waiting for selector '${selector}' with text '${text}' failed: timeout ${options.timeoutInMilliseconds}ms exceeded`,
      );
    }
    throw error;
  }
}
