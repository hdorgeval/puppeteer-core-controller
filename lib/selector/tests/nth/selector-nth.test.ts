import * as SUT from '../../../controller';
import { LaunchOptions } from '../../../controller';
import * as path from 'path';

describe('Puppeteer Controller - Selector API - find', (): void => {
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

  test('should throw an error when index is 0', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'selector-nth.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc.selector('[role="row"]').nth(0);
    let result: Error | undefined = undefined;
    try {
      await selector.getHandles();
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = 'Index is one-based';
    expect(result && result.message).toContain(expectedErrorMessage);
  });
  test('should get no handle on too big index', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'selector-nth.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc.selector('[role="row"]').nth(100);
    const handles = await selector.getHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(0);
  });

  test('should get first handle', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'selector-nth.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc
      .selector('[role="row"]')
      .find('select[data-test-id="my-select"]')
      .nth(1);
    const handles = await selector.getHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(1);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).value)).toBe('1');
    expect(selector.toString()).toBe(`selector([role="row"])
  .find(select[data-test-id="my-select"])
  .nth(1)`);
  });

  test('should get last handle', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'selector-nth.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc
      .selector('[role="row"]')
      .find('select[data-test-id="my-select"]')
      .nth(-1);
    const handles = await selector.getHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(1);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).value)).toBe('3');
    expect(selector.toString()).toBe(`selector([role="row"])
  .find(select[data-test-id="my-select"])
  .nth(-1)`);
  });

  test('should get the before the last handle', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'selector-nth.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc
      .selector('[role="row"]')
      .find('select[data-test-id="my-select"]')
      .nth(-2);
    const handles = await selector.getHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(1);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).value)).toBe('2');
    expect(selector.toString()).toBe(`selector([role="row"])
  .find(select[data-test-id="my-select"])
  .nth(-2)`);
  });

  test('should get the before the third handle', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'selector-nth.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc
      .selector('[role="row"]')
      .find('select[data-test-id="my-select"]')
      .nth(3);
    const handles = await selector.getHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(1);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).value)).toBe('3');
    expect(selector.toString()).toBe(`selector([role="row"])
  .find(select[data-test-id="my-select"])
  .nth(3)`);
  });

  test('should get handle, even when selector is created before page is instanciated', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    const selector = pptc
      .selector('[role="row"]')
      .find('select[data-test-id="my-select"]')
      .nth(3);

    const url = `file:${path.join(__dirname, 'selector-nth.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const handles = await selector.getHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(1);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).value)).toBe('3');
    expect(selector.toString()).toBe(`selector([role="row"])
  .find(select[data-test-id="my-select"])
  .nth(3)`);
  });
});
