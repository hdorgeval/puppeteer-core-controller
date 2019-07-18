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

  test('should give back an error on navigating to an url without doing an init', async (): Promise<
    void
  > => {
    // Given

    // When
    await pptc.navigateTo('https://www.google.fr');

    // Then
    const result = pptc.lastError;
    expect(result && result.message).toContain(
      "Cannot navigate to 'https://www.google.fr' because a new page has not been created",
    );
  });

  test('should initialize', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
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

  test('should start with max sized window', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: false,
    };
    const url = 'https://devexpress.github.io/testcafe/example';

    // When
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .withMaxSizeWindow()
      .navigateTo(url);

    const result = await pptc.getCurrentBrowserWindowState();

    // Then
    expect(result.isMaximized).toBe(true);
    expect(pptc.lastError).toBe(undefined);
  });
});
