import * as SUT from '../../../controller';
import { LaunchOptions } from '../../../controller';
import * as path from 'path';

describe('Puppeteer Controller - Selector API - withValue', (): void => {
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
    const url = `file:${path.join(__dirname, 'with-value.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc.selector('[role="row"]').withValue('foobar');
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
    const url = `file:${path.join(__dirname, 'with-value.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    // prettier-ignore
    const selector = pptc
      .selector('[role="row"]')
      .find('td')
      .find('input')
      .withValue('row2');
    const handles = await selector.getHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(1);
    expect(await handles[0].evaluate((node) => (node as HTMLInputElement).value)).toBe(
      'input row2',
    );
    expect(selector.toString()).toBe(`selector([role="row"])
  .find(td)
  .find(input)
  .withValue(row2)`);
  });

  test('should get handle, even when selector is created before page is instanciated', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    // prettier-ignore
    const selector = pptc
      .selector('[role="row"]')
      .find('td')
      .find('input')
      .withValue('row2');

    const url = `file:${path.join(__dirname, 'with-value.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const handles = await selector.getHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(1);
    expect(await handles[0].evaluate((node) => (node as HTMLInputElement).value)).toBe(
      'input row2',
    );
    expect(selector.toString()).toBe(`selector([role="row"])
  .find(td)
  .find(input)
  .withValue(row2)`);
  });

  test('should get all handles', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'with-value.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    // prettier-ignore
    const selector = pptc
      .selector('[role="row"]')
      .find('td')
      .find('input')
      .withValue('input');
    const handles = await selector.getHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(3);
    expect(await handles[0].evaluate((node) => (node as HTMLInputElement).value)).toBe(
      'input row1',
    );
    expect(await handles[1].evaluate((node) => (node as HTMLInputElement).value)).toBe(
      'input row2',
    );
    expect(await handles[2].evaluate((node) => (node as HTMLInputElement).value)).toBe(
      'input row3',
    );
    expect(selector.toString()).toBe(`selector([role="row"])
  .find(td)
  .find(input)
  .withValue(input)`);
  });
});
