import * as SUT from '../../../controller';
import { LaunchOptions } from '../../../controller';
import * as path from 'path';

describe('Puppeteer Controller - Selector API - doubleClick', (): void => {
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

  test('should wait and scroll before double clicking', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am dynamically added');

    const url = `file:${path.join(__dirname, 'double-click.test.html')}`;
    await pptc
      .initWith(launchOptions)
      .withCursor()
      .navigateTo(url);

    // When
    await selector.doubleClick({ delay: 200 });

    // Then
    await pptc.expectThat('#dynamically-added').hasFocus();
  });

  test('should wait for editability before double clicking', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    const selector = pptc
      .selector('[role="row"]')
      .find('input')
      .withValue('I am dynamically added');

    const url = `file:${path.join(__dirname, 'double-click.test.html')}`;
    await pptc
      .initWith(launchOptions)
      .withCursor()
      .navigateTo(url);

    // When
    await selector.doubleClick();

    // Then
    await pptc.expectThat('#dynamically-added-input').hasFocus();
  });

  test('should not double click on a transparent selector', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am transparent');

    const url = `file:${path.join(__dirname, 'double-click.test.html')}`;
    await pptc
      .initWith(launchOptions)
      .withCursor()
      .navigateTo(url);

    // When
    let result: Error | undefined = undefined;
    try {
      await selector.doubleClick({ timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = `Cannot double-click on selector([role="row"])
  .find(p)
  .withText(I am transparent) because this selector is not visible`;
    expect(result && result.message).toContain(expectedErrorMessage);
  });

  test('should not click when selector is out of screen', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am out of screen');

    const url = `file:${path.join(__dirname, 'double-click.test.html')}`;
    await pptc
      .initWith(launchOptions)
      .withCursor()
      .navigateTo(url);

    // When
    let result: Error | undefined = undefined;
    try {
      await selector.doubleClick({ timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = `Cannot double-click on selector([role="row"])
  .find(p)
  .withText(I am out of screen) because this selector is not visible`;
    expect(result && result.message).toContain(expectedErrorMessage);
  });

  test('should double click on a non editable div', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    const selector = pptc.selector('#double-click-me');

    const url = `file:${path.join(__dirname, 'double-click.test.html')}`;
    await pptc
      .initWith(launchOptions)
      .withCursor()
      .navigateTo(url)
      .wait(1000);

    // When
    await selector.doubleClick({ delay: 200 });

    // Then
    await pptc.expectThat('#double-click-me').hasText('clickedclicked');
  });
});
