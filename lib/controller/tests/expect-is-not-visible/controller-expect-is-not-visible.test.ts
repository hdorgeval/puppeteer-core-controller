import * as SUT from '../../controller';
import { LaunchOptions } from '../../../actions';
import * as path from 'path';

describe('Puppeteer Controller - assertion API - isNotVisible', (): void => {
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

  test('should not throw an error on asserting wrong selector', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const foobarSelector = 'foobar';

    // When
    let result: Error | undefined = undefined;
    try {
      // prettier-ignore
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .expectThat(foobarSelector)
        .isNotVisible();
    } catch (error) {
      result = error;
    }

    // Then
    expect(result).toBeUndefined();
  });

  test('should throw an error when selector is visible', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-expect-is-not-visible.test1.html')}`;

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .expectThat('#visible')
        .isNotVisible({ timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = "Error: selector '#visible' is visible.";
    expect(result && result.message).toContain(expectedErrorMessage);
    expect(pptc.lastError && pptc.lastError.message).toBe(expectedErrorMessage);
  });

  test('should throw an error when page is not created', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc.expectThat('foobar').isNotVisible({ timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = 'Error: expect statement only works when a page has been opened.';
    expect(result && result.message).toContain(expectedErrorMessage);
  });

  test('should expect is hidden', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-expect-is-not-visible.test1.html')}`;

    // When
    let result: Error | undefined = undefined;
    try {
      // prettier-ignore
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .expectThat('#hidden')
        .isNotVisible();
    } catch (error) {
      result = error;
    }

    // Then
    expect(result).toBeUndefined();
  });

  test('should wait for the selector to be hidden', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    const url = `file:${path.join(__dirname, 'controller-expect-is-not-visible.test1.html')}`;
    const selector = '#visible-then-hidden';

    await pptc.initWith(launchOptions).navigateTo(url);
    const wasInitiallyHidden = await pptc.isNotVisible(selector);

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc.expectThat(selector).isNotVisible();
    } catch (error) {
      result = error;
    }

    const wasFinallyHidden = await pptc.isNotVisible(selector);

    // Then
    expect(wasInitiallyHidden).toBe(false);
    expect(wasFinallyHidden).toBe(true);
    expect(result).toBeUndefined();
  });

  test('should handle the case where the selector is first hidden for a very short period, then visible', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    const url = `file:${path.join(__dirname, 'controller-expect-is-not-visible.test2.html')}`;
    const selector = '#hidden-then-visible';

    await pptc.initWith(launchOptions).navigateTo(url);
    const wasInitiallyHidden = await pptc.isNotVisible(selector);

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc.expectThat(selector).isNotVisible({ timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    const wasFinallyHidden = await pptc.isNotVisible(selector);

    // Then
    const expectedErrorMessage = "Error: selector '#hidden-then-visible' is visible.";
    expect(wasInitiallyHidden).toBe(true);
    expect(wasFinallyHidden).toBe(false);
    expect(result && result.message).toContain(expectedErrorMessage);
  });
});
