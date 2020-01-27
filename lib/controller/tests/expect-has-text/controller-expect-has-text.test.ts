import * as SUT from '../../controller';
import { LaunchOptions } from '../../../actions';
import * as path from 'path';

describe('Puppeteer Controller - ExpectThat - hasText', (): void => {
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
    const url = `file:${path.join(__dirname, 'controller-expect-has-text.test.html')}`;
    const selector = 'foobar';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .expectThat(selector)
        .hasText('YO', { timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = 'Error: failed to find element matching selector "foobar"';
    expect(result && result.message).toContain(expectedErrorMessage);
    expect(pptc.lastError && pptc.lastError.message).toBe(expectedErrorMessage);
  });

  test('should throw an error when selector does not have the expected text', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-expect-has-text.test.html')}`;
    const selector = 'p#uppercase';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .expectThat(selector)
        .isVisible()
        .expectThat(selector)
        .hasText('foobar', { timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      "Error: Selector 'p#uppercase' current innerText is: 'YO!', but this does not match the expected text: 'foobar'";
    expect(result && result.message).toContain(expectedErrorMessage);
    expect(pptc.lastError && pptc.lastError.message).toBe(expectedErrorMessage);
  });

  test('should throw an error when page is not created', async (): Promise<void> => {
    // Given
    const selector = 'p#uppercase';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc.expectThat(selector).hasText('', { timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = 'Error: expect statement only works when a page has been opened.';
    expect(result && result.message).toContain(expectedErrorMessage);
  });

  test('should expect the text', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-expect-has-text.test.html')}`;
    const selector = 'p#uppercase';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .expectThat(selector)
        .isVisible()
        .expectThat(selector)
        .hasText('YO');
    } catch (error) {
      result = error;
    }

    // Then
    expect(result).toBeUndefined();
  });

  test('should wait for the expected text', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-expect-has-text.test.html')}`;
    const selector = 'p#changing-content';

    // When
    await pptc
      .initWith(launchOptions)
      .navigateTo(url)
      .expectThat(selector)
      .isVisible();

    const initialContent = await pptc.getInnerTextOf(selector);

    await pptc.expectThat(selector).hasText('yo');

    const finalContent = await pptc.getInnerTextOf(selector);

    // Then
    expect(initialContent).toBe('foobar!');
    expect(finalContent).toBe('yo!');
  });

  test('should wait for the expected selector and text', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-expect-has-text.test.html')}`;
    const selector = 'p[data-e2e="dynamically-added"]';

    // When
    await pptc
      .initWith(launchOptions)
      .navigateTo(url)
      .expectThat(selector)
      .hasText('I am dynamically added in DOM');

    // Then
    expect(pptc.lastError).toBe(undefined);
  });
});
