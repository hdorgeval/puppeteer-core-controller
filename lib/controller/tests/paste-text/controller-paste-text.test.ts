import * as SUT from '../../controller';
import { LaunchOptions } from '../../../actions';
import * as path from 'path';

describe('Puppeteer Controller', (): void => {
  let pptc: SUT.PuppeteerController;
  beforeEach((): void => {
    jest.setTimeout(60000);
    pptc = new SUT.PuppeteerController();
  });
  afterEach(
    async (): Promise<void> => {
      await pptc.close();
    },
  );

  test('should paste text in input that already handles the paste event', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-paste-text.test.html')}`;
    const selector = 'input#emptyInput';

    // When
    await pptc
      .initWith(launchOptions)
      .navigateTo(url)
      .click(selector)
      .clear(selector)
      .pasteText('foo bar')
      .expectThat(selector)
      .hasFocus()
      .expectThat(selector)
      .hasExactValue('FOO BAR');

    // Then
    expect(pptc.lastError).toBe(undefined);
  });

  test('should paste text in content-editable element that do not handle the paste event', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-paste-text.test.html')}`;
    const selector = '#target';

    // When
    await pptc
      .initWith(launchOptions)
      .navigateTo(url)
      .click(selector)
      .clear(selector)
      .pasteText('foo bar', { handlePasteEvent: true })
      .expectThat(selector)
      .hasFocus()
      .expectThat(selector)
      .hasText('foo bar');

    // Then
    expect(pptc.lastError).toBe(undefined);
  });

  test('should paste text in input element that do not handle the paste event', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-paste-text.test.html')}`;
    const selector = '#targetInput';

    // When
    await pptc
      .initWith(launchOptions)
      .navigateTo(url)
      .click(selector)
      .clear(selector)
      .pasteText('foo bar', { handlePasteEvent: true })
      .expectThat(selector)
      .hasFocus()
      .expectThat(selector)
      .hasExactValue('foo bar');

    // Then
    expect(pptc.lastError).toBe(undefined);
  });
});
