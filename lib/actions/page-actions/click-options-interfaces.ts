import * as puppeteer from 'puppeteer-core';

export interface ClickOptions extends puppeteer.ClickOptions {
  timeoutInMilliseconds: number;
}

export const defaultClickOptions: ClickOptions = {
  timeoutInMilliseconds: 30000,
  delay: 100,
  button: 'left',
  clickCount: 1,
};
