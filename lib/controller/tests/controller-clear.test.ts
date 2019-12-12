import * as SUT from '../controller';
import { LaunchOptions } from '../../actions';
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

  test('should clear text on an existing input', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-clear.test.html')}`;
    const selector = 'input#enabledInput';

    // When
    await pptc
      .initWith(launchOptions)
      .navigateTo(url)
      .expectThat(selector)
      .isEnabled()
      .expectThat(selector)
      .hasExactValue('I will be cleared !')
      .clear(selector);

    // Then
    const result = await pptc.getValueOf(selector);
    expect(result).toBe('');
    expect(pptc.lastError).toBe(undefined);
  });
});
