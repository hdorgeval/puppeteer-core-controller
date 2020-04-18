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

    // prettier-ignore
    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am dynamically added');

    const url = `file:${path.join(__dirname, 'click.test.html')}`;
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .withCursor()
      .navigateTo(url);

    // When
    await selector.click();

    // Then
    await pptc.expectThat('#dynamically-added').hasFocus();
  });

  test('should wait for editability before clicking', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    const selector = pptc
      .selector('[role="row"]')
      .find('input')
      .withValue('I am dynamically added');

    const url = `file:${path.join(__dirname, 'click.test.html')}`;
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .withCursor()
      .navigateTo(url);

    // When
    await selector.click();

    // Then
    await pptc.expectThat('#dynamically-added-input').hasFocus();
  });

  test('should not click on a transparent selector', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    // prettier-ignore
    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am transparent');

    const url = `file:${path.join(__dirname, 'click.test.html')}`;
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .withCursor()
      .navigateTo(url);

    // When
    let result: Error | undefined = undefined;
    try {
      await selector.click({ timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = `Cannot click on selector([role="row"])
  .find(p)
  .withText(I am transparent) because this selector is not visible`;
    expect(result && result.message).toContain(expectedErrorMessage);
  });

  test('should not click when selector is out of screen', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    // prettier-ignore
    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am out of screen');

    const url = `file:${path.join(__dirname, 'click.test.html')}`;
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .withCursor()
      .navigateTo(url);

    // When
    let result: Error | undefined = undefined;
    try {
      await selector.click({ timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = `Cannot click on selector([role="row"])
  .find(p)
  .withText(I am out of screen) because this selector is not visible`;
    expect(result && result.message).toContain(expectedErrorMessage);
  });
});
