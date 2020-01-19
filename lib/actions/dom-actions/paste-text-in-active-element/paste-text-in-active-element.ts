import * as puppeteer from 'puppeteer-core';
import { PasteOptions } from '../paste-text';
import { hasActiveElement } from '../has-active-element';
declare const window: Window;

export const defaultPasteOptions: PasteOptions = {
  handlePasteEvent: false,
};
export async function pasteTextInActiveElement(
  text: string,
  options: PasteOptions,
  page: puppeteer.Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(`Error: cannot paste text '${text}' because a new page has not been created`);
  }

  // TODO: refactor next line to be wait-until-has-active-element
  const hasPageActiveElement = await hasActiveElement(page);
  if (!hasPageActiveElement) {
    throw new Error(
      `Cannot paste text '${text}' because there is no active element in the page. You must first click on a selector and then clear it's content before pasting text.`,
    );
  }

  await page.evaluate(
    (content: string, handlePasteEvent: boolean): void => {
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

      const activeElement = window.document.activeElement;
      if (activeElement === null) {
        throw new Error(
          'No active element found in the page. Maybe the previously active element has lost focus.',
        );
      }

      if (handlePasteEvent) {
        attachPasteEvent(activeElement);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).clipboardData = { getData: (): string => content };
      // eslint-disable-next-line no-undef
      const event = new CustomEvent('paste', {
        bubbles: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (event as any).clipboardData = { getData: (): string => content };
      activeElement.dispatchEvent(event);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).clipboardData = undefined;
    },
    text,
    options.handlePasteEvent,
  );
}
