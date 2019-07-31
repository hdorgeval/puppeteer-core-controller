import * as SUT from '../controller';
import { LaunchOptions } from '../../actions';

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
        .hasClass('yo', { timeoutInMilliseconds: 5000 })
        .typeText('foo.bar@baz.com');
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
    const url = 'https://reactstrap.github.io/components/form';
    const validInput = 'input[type="text"].is-valid.form-control';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .click(validInput)
        .typeText('foo.bar@baz.com')
        .pressKey('Tab')
        .expectThat(validInput)
        .hasClass('is-invalid', { timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = `Error: selector '${validInput}' does not have the class 'is-invalid'.`;
    expect(result && result.message).toContain(expectedErrorMessage);
    expect(pptc.lastError && pptc.lastError.message).toBe(expectedErrorMessage);
  });

  test('should throw an error when page is not created', async (): Promise<void> => {
    // Given
    const validInput = 'input[type="text"].is-valid.form-control';

    // When
    let result: Error | undefined = undefined;
    try {
      // prettier-ignore
      await pptc
        .expectThat(validInput)
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
    const url = 'https://reactstrap.github.io/components/form';
    const validInput = 'input[type="text"].is-valid.form-control';

    // When
    await pptc
      .initWith(launchOptions)
      .navigateTo(url)
      .click(validInput)
      .typeText('foo.bar@baz.com')
      .pressKey('Tab')
      .expectThat(validInput)
      .hasClass('is-valid');

    // Then
    const isInvalid = await pptc.hasClass(validInput, 'is-invalid');
    expect(isInvalid).toBe(false);
    expect(pptc.lastError).toBe(undefined);
  });
});
