import * as SUT from './controller';
import { LaunchOptions } from './actions';
describe('Puppeteer Controller', (): void => {
  let pptc: SUT.PuppeteerController;
  beforeEach((): void => {
    pptc = new SUT.PuppeteerController();
  });
  afterEach(
    async (): Promise<void> => {
      await pptc.close();
    },
  );
  test('should give back an error on incorrect browser path', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
      executablePath: 'yo.app',
    };

    // When
    await pptc.initWith(launchOptions);

    // Then
    const result = pptc.lastError;
    expect(result && result.message).toContain('Failed to launch chrome');
  });

  test('should initialize', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    };

    // When
    await pptc.initWith(launchOptions);

    // Then
    expect(pptc.lastError).toBe(undefined);
  });

  test('should navigate to url', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    };
    const url = 'https://devexpress.github.io/testcafe/example';

    // When
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .navigateTo(url);

    // Then
    expect(await pptc.getCurrentUrl()).toBe(`${url}/`);
    expect(pptc.lastError).toBe(undefined);
  });
});
