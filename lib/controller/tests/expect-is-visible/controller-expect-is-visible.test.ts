import * as SUT from '../../controller';
import { LaunchOptions } from '../../../actions';
import * as path from 'path';

describe('Puppeteer Controller - assertion API - isVisible', (): void => {
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

  test('should throw an error on asserting wrong selector', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const foobarSelector = 'foobar';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .expectThat(foobarSelector)
        .isVisible({ timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = "Error: selector 'foobar' is not visible.";
    expect(result && result.message).toContain(expectedErrorMessage);
    expect(pptc.lastError && pptc.lastError.message).toBe(expectedErrorMessage);
  });

  test('should throw an error when selector is hidden', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-expect-is-visible.test1.html')}`;

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .expectThat('#hidden')
        .isVisible({ timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = "Error: selector '#hidden' is not visible.";
    expect(result && result.message).toContain(expectedErrorMessage);
    expect(pptc.lastError && pptc.lastError.message).toBe(expectedErrorMessage);
  });

  test('should throw an error when page is not created', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc.expectThat('foobar').isVisible({ timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = 'Error: expect statement only works when a page has been opened.';
    expect(result && result.message).toContain(expectedErrorMessage);
  });

  test('should expect is visible', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-expect-is-visible.test1.html')}`;

    // When
    let result: Error | undefined = undefined;
    try {
      // prettier-ignore
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .expectThat('#visible')
        .isVisible();
    } catch (error) {
      result = error;
    }

    // Then
    expect(result).toBeUndefined();
  });

  test('should wait for the selector to be visible', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    const url = `file:${path.join(__dirname, 'controller-expect-is-visible.test1.html')}`;
    const selector = '#hidden-then-visible';

    await pptc.initWith(launchOptions).navigateTo(url);
    const wasInitiallyVisible = await pptc.isVisible(selector);

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc.expectThat(selector).isVisible();
    } catch (error) {
      result = error;
    }

    const wasFinallyVisible = await pptc.isVisible(selector);

    // Then
    expect(wasInitiallyVisible).toBe(false);
    expect(wasFinallyVisible).toBe(true);
    expect(result).toBeUndefined();
  });
});
