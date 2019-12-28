import * as SUT from '../../../controller';
import { LaunchOptions } from '../../../controller';
import * as path from 'path';

describe('Puppeteer Controller - Selector API - count', (): void => {
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

  test('should return zero on wrong selector', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'count.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc.selector('foo').withText('bar');
    const result = await selector.count();

    // Then
    expect(result).toBe(0);
  });

  test('should return the number of found elements', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'count.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector1 = pptc.selector('[role="row"]');
    const selector2 = pptc.selector('[role="row"]').find('td');
    const selector3 = pptc
      .selector('[role="row"]')
      .find('td')
      .find('[data-test-id="my-select"]');

    const result1 = await selector1.count();
    const result2 = await selector2.count();
    const result3 = await selector3.count();

    // Then
    expect(result1).toBe(3);
    expect(result2).toBe(6);
    expect(result3).toBe(3);
  });

  test('should count when selector is transparent', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'count.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am transparent');

    const result = await selector.count();

    // Then
    expect(result).toBe(1);
  });

  test('should count, even when selector is created before page is instanciated', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am transparent');

    const url = `file:${path.join(__dirname, 'count.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const result = await selector.count();

    // Then
    expect(result).toBe(1);
  });
});
