import * as SUT from '../../../controller';
import { LaunchOptions } from '../../../controller';
import * as path from 'path';

describe('Puppeteer Controller - Selector API - exists', (): void => {
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

  test('should return false on wrong selector', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'exists.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc.selector('foo').withText('bar');
    const result = await selector.exists();

    // Then
    expect(result).toBe(false);
  });

  test('should return true when selector is visible', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'exists.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    // prettier-ignore
    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am visible');

    const result = await selector.exists();

    // Then
    expect(result).toBe(true);
  });

  test('should return true when selector is hidden', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'exists.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    // prettier-ignore
    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am hidden');

    const result = await selector.exists();
    const isVisible = await selector.isVisible();

    // Then
    expect(result).toBe(true);
    expect(isVisible).toBe(false);
  });
  test('should return true when selector is transparent', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'exists.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    // prettier-ignore
    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am transparent');

    const result = await selector.exists();

    // Then
    expect(result).toBe(true);
  });

  test('should return true when selector is out of screen', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'exists.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    // prettier-ignore
    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am out of screen');

    const result = await selector.exists();

    // Then
    expect(result).toBe(true);
  });
  test('should return true when selector is first hidden', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'exists.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc
      .selector('[role="row"]')
      .find('td')
      .withText('hidden, then visible')
      .find('p'); //only the <p> ... </p> element is hidden first

    const initialExistsStatus = await selector.exists();
    await pptc.wait(5000);
    const finalExistsStatus = await selector.exists();

    // Then
    expect(initialExistsStatus).toBe(true);
    expect(finalExistsStatus).toBe(true);
  });

  test('should wait for selector to exists', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'exists.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc.selector('p').withText('I am dynamically added');

    const initialExistsStatus = await selector.exists();
    await pptc.waitUntil(() => selector.exists(), { verbose: true });
    const finalExistsStatus = await selector.exists();

    // Then
    expect(initialExistsStatus).toBe(false);
    expect(finalExistsStatus).toBe(true);
  });

  test('should return true, even when selector is created before page is instanciated', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    // prettier-ignore
    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am visible');

    const url = `file:${path.join(__dirname, 'exists.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const result = await selector.exists();

    // Then
    expect(result).toBe(true);
  });
});
