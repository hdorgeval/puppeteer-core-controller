import * as puppeteer from 'puppeteer-core';
declare const window: Window;

export interface PasteOptions {
  handlePasteEvent: boolean;
}

export const defaultPasteOptions: PasteOptions = {
  handlePasteEvent: false,
};
export async function pasteText(
  selector: string,
  text: string,
  options: PasteOptions,
  page: puppeteer.Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(
      `Error: cannot paste text '${text}' in '${selector}' because a new page has not been created`,
    );
  }

  await page.$eval(
    selector,
    (el: Element, content: string, handlePasteEvent: boolean): void => {
      function attachPasteEvent(el: Element): void {
        el.addEventListener('paste', (event: Event | InputEvent | ClipboardEvent) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const content = ((event as any).clipboardData || (window as any).clipboardData).getData(
            'text',
          ) as string;
          const input = event.target as HTMLInputElement;
          if (event.target && input && input.tagName === 'INPUT') {
            input.value = content;
            event.preventDefault();
            return;
          }
          (event.target as HTMLElement).innerText = content;
          event.preventDefault();
        });
      }

      if (handlePasteEvent) {
        attachPasteEvent(el);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).clipboardData = { getData: (): string => content };
      const event = new CustomEvent('paste', {
        bubbles: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (event as any).clipboardData = { getData: (): string => content };
      el.dispatchEvent(event);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).clipboardData = undefined;
    },
    text,
    options.handlePasteEvent,
  );
}
