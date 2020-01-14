import * as SUT from '../../../controller';
import { LaunchOptions } from '../../../controller';
import * as path from 'path';

describe('Puppeteer Controller - Selector API - immutability', (): void => {
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

  test.skip('should be immutable', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: false,
    };
    const url = `file:${path.join(__dirname, 'immutability.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    const container = pptc.selector('[role="row"]').find('td');
    // const cell1 = container.withText('row1');
    // const cell2 = container.withText('row2');
    // const cell3 = container.withText('row3');

    // When
    const containerCount = await container.count();
    // const handle1 = await cell1.getFirstHandleOrNull();
    // const handle2 = await cell2.getFirstHandleOrNull();
    // const handle3 = await cell3.getFirstHandleOrNull();

    // Then
    expect(containerCount).toBe(6);
    // expect(handle1).not.toBe(null);
    // expect(handle2).not.toBe(null);
    // expect(handle3).not.toBe(null);
  });
});
