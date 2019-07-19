import * as SUT from './controller';
import { LaunchOptions } from './actions';
describe('Puppeteer Controller', (): void => {
  let pptc: SUT.PuppeteerController;
  beforeEach((): void => {
    jest.setTimeout(15000);
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
    console.log('result', result);
    expect(result.isMaximized).toBe(true);
    expect(pptc.lastError).toBe(undefined);
  });
});
