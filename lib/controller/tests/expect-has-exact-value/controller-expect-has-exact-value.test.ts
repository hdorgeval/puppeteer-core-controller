import * as SUT from '../../controller';
import { LaunchOptions } from '../../../actions';

describe('Puppeteer Controller - ExpectThat - hasExactValue', (): void => {
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
    const emailInputSelector = 'input#exampleEmail';
    const foobarSelector = 'foobar';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .click(emailInputSelector)
        .expectThat(foobarSelector)
        .hasExactValue('')
        .typeText('foo.bar@baz.com');
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = 'Error: failed to find element matching selector "foobar"';
    expect(result && result.message).toContain(expectedErrorMessage);
    expect(pptc.lastError && pptc.lastError.message).toBe(expectedErrorMessage);
  });

  test('should throw an error when selector does not have the expected value', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const emailInputSelector = 'input#exampleEmail';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .click(emailInputSelector)
        .typeText('foo.bar@baz.com')
        .expectThat(emailInputSelector)
        .hasExactValue('foobar', { timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      "Error: Selector 'input#exampleEmail' current value is: 'foo.bar@baz.com', but this does not match the expected value: 'foobar'";
    expect(result && result.message).toContain(expectedErrorMessage);
    expect(pptc.lastError && pptc.lastError.message).toBe(expectedErrorMessage);
  });

  test('should throw an error when page is not created', async (): Promise<void> => {
    // Given
    const passwordInputSelector = 'input#examplePassword';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .expectThat(passwordInputSelector)
        .hasExactValue('', { timeoutInMilliseconds: 5000 })
        .typeText('foo.bar@baz.com');
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = 'Error: expect statement only works when a page has been opened.';
    expect(result && result.message).toContain(expectedErrorMessage);
  });

  test('should expect the value', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const emailInputSelector = 'input#exampleEmail';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .click(emailInputSelector)
        .typeText('foo.bar@baz.com')
        .expectThat(emailInputSelector)
        .hasExactValue('foo.bar@baz.com');
    } catch (error) {
      result = error;
    }

    // Then
    expect(result).toBeUndefined();
  });
});
