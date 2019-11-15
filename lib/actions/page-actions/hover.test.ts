import * as puppeteer from 'puppeteer-core';
import { getChromePath } from '../../utils';
import { launchBrowser, showMousePosition } from '..';
import * as SUT from './index';
import { getClientRectangleOf } from '../dom-actions';

describe('hover', (): void => {
  let browser: puppeteer.Browser | undefined = undefined;
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  afterEach(
    async (): Promise<void> => {
      if (browser) {
        await browser.close();
      }
    },
  );

  test('should hover on the page', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';
    const emailInputSelector = 'input#exampleEmail';

    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();

    // When
    await showMousePosition(page);
    await page.goto(url);
    await SUT.hover(emailInputSelector, SUT.defaultHoverOptions, page);

    // Then
    const emailInputClienttRectangle = await getClientRectangleOf(emailInputSelector, page);
    const expectedX = emailInputClienttRectangle.left + emailInputClienttRectangle.width / 2;
    const expectedY = emailInputClienttRectangle.top + emailInputClienttRectangle.height / 2;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(Math.abs((page.mouse as any)._x - expectedX)).toBeLessThan(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(Math.abs((page.mouse as any)._y - expectedY)).toBeLessThan(1);
  });
});
