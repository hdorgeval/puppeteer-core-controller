import * as SUT from '../../controller';
import { LaunchOptions } from '../../../actions';
import * as path from 'path';

describe('Puppeteer Controller', (): void => {
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
    const url = `file:${path.join(__dirname, 'controller-expect-has-class.test.html')}`;
    const selector = 'foobar';
    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .expectThat(selector)
        .hasClass('yo', { timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = 'Error: failed to find element matching selector "foobar"';
    expect(result && result.message).toContain(expectedErrorMessage);
    expect(pptc.lastError && pptc.lastError.message).toBe(expectedErrorMessage);
  });

  test('should throw an error when selector does not have the specified class', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-expect-has-class.test.html')}`;
    const selector = 'input#input1';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .click(selector)
        .clear(selector)
        .typeText('foo.bar@baz.com')
        .pressKey('Tab')
        .expectThat(selector)
        .hasClass('is-invalid', { timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = `Error: Selector '${selector}' current class list is: [foo, foo1, foo2], but this list does not contain the expected value: 'is-invalid'.`;
    expect(result && result.message).toContain(expectedErrorMessage);
    expect(pptc.lastError && pptc.lastError.message).toBe(expectedErrorMessage);
  });
  test('should throw an error when selector has no class', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-expect-has-class.test.html')}`;
    const selector = 'input#input0';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .click(selector)
        .clear(selector)
        .typeText('foo.bar@baz.com')
        .pressKey('Tab')
        .expectThat(selector)
        .hasClass('is-invalid', { timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = `Error: Selector '${selector}' current class list is: [], but this list does not contain the expected value: 'is-invalid'.`;
    expect(result && result.message).toContain(expectedErrorMessage);
    expect(pptc.lastError && pptc.lastError.message).toBe(expectedErrorMessage);
  });

  test('should throw an error when page is not created', async (): Promise<void> => {
    // Given
    const selector = 'foobar';

    // When
    let result: Error | undefined = undefined;
    try {
      // prettier-ignore
      await pptc
        .expectThat(selector)
        .hasClass('is-valid', { timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = 'Error: expect statement only works when a page has been opened.';
    expect(result && result.message).toContain(expectedErrorMessage);
  });

  test('should expect className', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-expect-has-class.test.html')}`;
    const selector = 'input#input1';

    // When
    await pptc
      .initWith(launchOptions)
      .navigateTo(url)
      .click(selector)
      .expectThat(selector)
      .hasClass('foo');

    // Then
    const hasClass = await pptc.hasClass(selector, 'foo');
    expect(hasClass).toBe(true);
    expect(pptc.lastError).toBe(undefined);
  });

  test('should expect className among many', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-expect-has-class.test.html')}`;
    const selector = 'input#input2';

    // When
    await pptc
      .initWith(launchOptions)
      .navigateTo(url)
      .click(selector)
      .expectThat(selector)
      .hasClass('foo')
      .expectThat(selector)
      .hasClass('bar');

    // Then
    const hasClass = await pptc.hasClass(selector, 'foobar');
    expect(hasClass).toBe(false);
    expect(pptc.lastError).toBe(undefined);
  });

  test('should wait for the className', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-expect-has-class.test.html')}`;
    const selector = 'input#input3';

    // When
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .navigateTo(url)
      .click(selector);

    const previousStatus = await pptc.hasClass(selector, 'foobar');
    await pptc.expectThat(selector).hasClass('foobar');

    // Then
    const currentStatus = await pptc.hasClass(selector, 'foobar');
    expect(previousStatus).toBe(false);
    expect(currentStatus).toBe(true);
    expect(pptc.lastError).toBe(undefined);
  });

  test('should wait for the selector and the className', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-expect-has-class.test.html')}`;
    const selector = 'input#input4';

    // When
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .navigateTo(url)
      .expectThat(selector)
      .hasClass('foobar');

    // Then
    expect(pptc.lastError).toBe(undefined);
  });
});
