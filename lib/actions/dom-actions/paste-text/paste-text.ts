import * as puppeteer from 'puppeteer-core';
declare const window: Window;
export async function pasteText(
  selector: string,
  text: string,
  page: puppeteer.Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(
      `Error: cannot paste text '${text}' in '${selector}' because a new page has not been created`,
    );
  }

  await page.$eval(
    selector,
    (el: Element, content: string): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).clipboardData = { getData: (): string => content };
      // eslint-disable-next-line no-undef
      const event = new CustomEvent('paste', {
        bubbles: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (event as any).clipboardData = { getData: (): string => content };
      el.dispatchEvent(event);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).clipboardData = undefined;

      // TODO: auto add 'paste' event listener if needed
    },
    text,
  );
}
