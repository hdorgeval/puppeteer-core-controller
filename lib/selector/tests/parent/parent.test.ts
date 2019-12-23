import * as SUT from '../../../controller';
import { LaunchOptions } from '../../../controller';
import * as path from 'path';

describe('Puppeteer Controller - Selector API - parent', (): void => {
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

  test('should get no handle on wrong selector', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'parent.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc
      .selector('[role="row"]')
      .withText('foobar')
      .parent();
    const handles = await selector.getHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(0);
  });

  test('should get handle', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'parent.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc
      .selector('[role="row"]')
      .find('td')
      .withText('row2')
      .parent();

    const handles = await selector.getHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(1);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).tagName)).toBe('TR');
    expect(selector.toString()).toBe(`selector([role="row"])
  .find(td)
  .withText(row2)
  .parent()`);
  });

  test('should get handles, even when selector is created before page is instanciated', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const selector = pptc
      .selector('[role="row"]')
      .find('td')
      .withText('row2')
      .parent();

    const url = `file:${path.join(__dirname, 'parent.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const handles = await selector.getHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(1);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).tagName)).toBe('TR');
    expect(selector.toString()).toBe(`selector([role="row"])
  .find(td)
  .withText(row2)
  .parent()`);
  });
});
