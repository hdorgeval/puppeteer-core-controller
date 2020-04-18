import * as SUT from '../../../controller';
import { LaunchOptions } from '../../../controller';
import * as path from 'path';

describe('Puppeteer Controller - Selector API - hover', (): void => {
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

  test('should hover on an element already inside the viewport', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    const selector = pptc.selector('#in-view-port');

    const url = `file:${path.join(__dirname, 'hover.test.html')}`;
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .withCursor()
      .navigateTo(url);

    // When
    await selector.hover();

    // Then
    await pptc.expectThat('#in-view-port').hasExactValue('I am hovered');
  });

  test('should hover on an element already outside the viewport', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    const selector = pptc.selector('input#out-of-view-port');

    const url = `file:${path.join(__dirname, 'hover.test.html')}`;
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .withCursor()
      .navigateTo(url);

    // When
    await selector.hover();

    // Then
    await pptc.expectThat('input#out-of-view-port').hasExactValue('I am hovered');
  });
});
