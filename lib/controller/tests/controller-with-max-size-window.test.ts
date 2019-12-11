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

  test('should start with max sized window', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: false,
    };
    const url = 'https://reactstrap.github.io/components/form';

    // When
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .withMaxSizeWindow()
      .navigateTo(url);

    // Then
    const result = await pptc.getCurrentBrowserWindowState();
    // eslint-disable-next-line no-console
    console.log('browser window state:', result);
    expect(result.isMaximized).toBe(true);
    expect(pptc.lastError).toBe(undefined);
  });

  test('should start with min sized window', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';

    // When
    await pptc
      .initWith(launchOptions)
      .withMaxSizeWindow({ minWidth: 2000, minHeight: 2001 })
      .navigateTo(url);

    // Then
    const result = await pptc.getCurrentBrowserWindowState();
    expect(result.innerWidth).toBe(2000);
    expect(result.innerHeight).toBe(2001);
    expect(pptc.lastError).toBe(undefined);
  });
});
