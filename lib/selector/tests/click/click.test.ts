import * as SUT from '../../../controller';
import { LaunchOptions } from '../../../controller';
import * as path from 'path';

describe('Puppeteer Controller - Selector API - click', (): void => {
  let pptc: SUT.PuppeteerController;
  beforeEach((): void => {
    jest.setTimeout(30000);
    pptc = new SUT.PuppeteerController();
  });
  afterEach(
    async (): Promise<void> => {
      await pptc.close();
    },
  );

  test('should wait and scroll before clicking', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am dynamically added');

    const url = `file:${path.join(__dirname, 'click.test.html')}`;
    await pptc
      .initWith(launchOptions)
      .withCursor()
      .navigateTo(url);

    // When
    await selector.click();

    // Then
    expect(true).toBe(true);
  });

  test.skip('should return false when selector is transparent', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'is-visible.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am transparent');

    const result = await selector.isVisible();

    // Then
    expect(result).toBe(false);
  });

  test.skip('should return false when selector is out of screen', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'is-visible.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am out of screen');

    const result = await selector.isVisible();

    // Then
    expect(result).toBe(false);
  });
  test.skip('should return false when selector is first hidden', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'is-visible.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc
      .selector('[role="row"]')
      .find('td')
      .withText('hidden, then visible')
      .find('p'); //only the <p> ... </p> element is hidden first

    const initialVisibleStatus = await selector.isVisible();
    await pptc.wait(5000);
    const finalVisibleStatus = await selector.isVisible();

    // Then
    expect(initialVisibleStatus).toBe(false);
    expect(finalVisibleStatus).toBe(true);
  });

  test.skip('should return true, even when selector is created before page is instanciated', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am visible');

    const url = `file:${path.join(__dirname, 'is-visible.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const result = await selector.isVisible();

    // Then
    expect(result).toBe(true);
  });
});
