import * as SUT from './controller';
import { LaunchOptions } from '../actions';

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

  test('should click on an existing checkbox', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const checkMeOutSelector = 'input[type="checkbox"].form-check-input';

    // When
    await pptc
      .initWith(launchOptions)
      .withMaxSizeWindow()
      .navigateTo(url)
      .click(checkMeOutSelector);

    // Then
    const isChecked = await pptc.isChecked(checkMeOutSelector);
    expect(isChecked).toBe(true);
    expect(pptc.lastError).toBe(undefined);
  });
});
