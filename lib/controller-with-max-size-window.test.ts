import * as SUT from './controller';
import { LaunchOptions } from './actions';

describe('Puppeteer Controller', (): void => {
  let pptc: SUT.PuppeteerController;
  beforeEach((): void => {
    jest.setTimeout(15000);
    pptc = new SUT.PuppeteerController();
  });

  test('should start with max sized window', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';

    // When
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .withMaxSizeWindow()
      .navigateTo(url)
      .then(async(): Promise<void> => {
        
        // Then
        const result = await pptc.getCurrentBrowserWindowState();
        expect(result.isMaximized).toBe(true);
        expect(pptc.lastError).toBe(undefined);
      })
      .then(async ():Promise<void> => await pptc.close());
  });
});
