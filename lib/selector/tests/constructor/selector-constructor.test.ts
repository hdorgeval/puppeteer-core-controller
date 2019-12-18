import * as SUT from '../../../controller';
import { LaunchOptions } from '../../../controller';
import * as path from 'path';

describe('Puppeteer Controller - Selector API - constructor', (): void => {
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

  test('should throw an error when page is not created', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      const selector = pptc.selector('foobar');
      await selector.getHandles();
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      "Error: cannot query selector 'foobar' because a new page has not been created";
    expect(result && result.message).toContain(expectedErrorMessage);
  });

  test('should get no handle on wrong selector', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'selector-constructor.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc.selector('foobar');
    const handles = await selector.getHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(0);
  });

  test('should get handles', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'selector-constructor.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc.selector('[role="row"]');
    const handles = await selector.getHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(3);
    expect((await handles[0].getProperty('innerText')).toString()).toContain('row1');
    expect((await handles[1].getProperty('innerText')).toString()).toContain('row2');
    expect((await handles[2].getProperty('innerText')).toString()).toContain('row3');
    expect(selector.toString()).toBe('[role="row"]');
  });

  test('should get handles, even when selector is created before page is instanciated', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'selector-constructor.test.html')}`;
    const selector = pptc.selector('[role="row"]');
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const handles = await selector.getHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(3);
    expect((await handles[0].getProperty('innerText')).toString()).toContain('row1');
    expect((await handles[1].getProperty('innerText')).toString()).toContain('row2');
    expect((await handles[2].getProperty('innerText')).toString()).toContain('row3');
    expect(selector.toString()).toBe('[role="row"]');
  });
});
