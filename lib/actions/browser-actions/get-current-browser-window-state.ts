import * as puppeteer from 'puppeteer-core';
declare const window: Window;

export interface WindowState {
  innerHeight: number;
  innerWidth: number;
  isMaximized: boolean;
  outerHeight: number;
  outerWidth: number;
  screen: {
    availWidth: number;
    availHeight: number;
  };
}
export async function getCurrentBrowserWindowState(
  page: puppeteer.Page | undefined,
): Promise<WindowState> {
  if (page) {
    const windowStateSerialized = await page.evaluate((): string => {
      const result = {
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        screen: {
          availWidth: window.screen.availWidth,
          availHeight: window.screen.availHeight,
        },
        isMaximized:
          Math.abs(window.outerWidth - window.screen.availWidth) <
            window.screen.availWidth * 0.03 &&
          Math.abs(window.outerHeight - window.screen.availHeight) <
            window.screen.availHeight * 0.03,
      };
      return JSON.stringify(result);
    });
    const windowState = JSON.parse(windowStateSerialized);
    return windowState;
  }
  throw new Error('Error: cannot get current window because a new page has not been created');
}
