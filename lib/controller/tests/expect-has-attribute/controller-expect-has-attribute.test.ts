import * as SUT from '../../controller';
import { LaunchOptions } from '../../../actions';
import * as path from 'path';

describe('Puppeteer Controller - ExpectThat - hasAttribute', (): void => {
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
    const url = `file:${path.join(__dirname, 'controller-expect-has-attribute.test.html')}`;
    const selector = 'foobar';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .expectThat(selector)
        .hasAttribute('foo')
        .withValue('bar', { timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = 'Error: failed to find element matching selector "foobar"';
    expect(result && result.message).toContain(expectedErrorMessage);
    expect(pptc.lastError && pptc.lastError.message).toBe(expectedErrorMessage);
  });

  test('should throw an error when selector does not have the expected attribute', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-expect-has-attribute.test.html')}`;
    const selector = 'p#no-attr';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .expectThat(selector)
        .hasAttribute('foo')
        .withValue('bar', { timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      "Error: Selector 'p#no-attr' does not have the attribute 'foo' with the value 'bar'.";
    expect(result && result.message).toContain(expectedErrorMessage);
    expect(pptc.lastError && pptc.lastError.message).toBe(expectedErrorMessage);
  });

  test('should throw an error when page is not created', async (): Promise<void> => {
    // Given
    const selector = 'p#no-attr';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .expectThat(selector)
        .hasAttribute('foo')
        .withValue('bar', { timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = 'Error: expect statement only works when a page has been opened.';
    expect(result && result.message).toContain(expectedErrorMessage);
  });

  test('should expect the attribute and its value', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-expect-has-attribute.test.html')}`;
    const selector = 'p#with-attr';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .expectThat(selector)
        .hasAttribute('foo')
        .withValue('bar');
    } catch (error) {
      result = error;
    }

    // Then
    expect(result).toBeUndefined();
  });

  test('should wait for the expected attribute and value', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-expect-has-attribute.test.html')}`;
    const selector = 'p#changing-attr';

    // When
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .navigateTo(url)
      .expectThat(selector)
      .isVisible();

    const initialHasAttribute = await pptc.hasAttributeWithValue(selector, 'foo', 'bar');

    // prettier-ignore
    await pptc
      .expectThat(selector)
      .hasAttribute('foo')
      .withValue('bar');

    const finalHasAttribute = await pptc.hasAttributeWithValue(selector, 'foo', 'bar');

    // Then
    expect(initialHasAttribute).toBe(false);
    expect(finalHasAttribute).toBe(true);
  });

  test('should wait for the selector and the expected attribute and value', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-expect-has-attribute.test.html')}`;
    const selector = 'p#dynamically-added';

    // When
    await pptc
      .initWith(launchOptions)
      .navigateTo(url)
      .expectThat(selector)
      .hasAttribute('data-e2e')
      .withValue('foobar');

    // Then
    expect(pptc.lastError).toBe(undefined);
  });
});
