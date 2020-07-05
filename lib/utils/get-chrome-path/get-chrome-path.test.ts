/* eslint-disable @typescript-eslint/no-var-requires */
describe('get-chrome-path', (): void => {
  afterEach((): void => {
    jest.resetModules();
  });
  test('should return default windows path on Windows platform', (): void => {
    // Given
    jest.mock('os', (): unknown => ({
      // eslint-disable-next-line @typescript-eslint/ban-types
      ...jest.requireActual<Object>('os'),
      type: (): string => 'Windows_NT',
    }));

    // When
    const result = require('./get-chrome-path').getChromePath();

    // Then
    expect(result).toBe('C:/Program Files (x86)/Google/Chrome/Application/chrome.exe');
  });

  test('should return default MacOS path on MAcOS platform', (): void => {
    // Given
    jest.mock('os', (): unknown => ({
      // eslint-disable-next-line @typescript-eslint/ban-types
      ...jest.requireActual<Object>('os'),
      type: (): string => 'Darwin',
    }));

    // When
    const result = require('./get-chrome-path').getChromePath();

    // Then
    expect(result).toBe('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
  });

  test('should return default Unix path on Unix platform for google stable install', (): void => {
    // Given
    jest.mock('os', (): unknown => ({
      // eslint-disable-next-line @typescript-eslint/ban-types
      ...jest.requireActual<Object>('os'),
      type: (): string => 'Linux',
    }));
    jest.mock('which', (): unknown => ({
      // eslint-disable-next-line @typescript-eslint/ban-types
      ...jest.requireActual<Object>('which'),
      sync: (): boolean => true,
    }));

    // WHen
    const result = require('./get-chrome-path').getChromePath();

    // Then
    expect(result).toBe('google-chrome-stable');
  });

  test('should return default Unix path on Unix platform for google install', (): void => {
    // Given
    jest.mock('os', (): unknown => ({
      // eslint-disable-next-line @typescript-eslint/ban-types
      ...jest.requireActual<Object>('os'),
      type: (): string => 'Linux',
    }));
    jest.mock('which', (): unknown => ({
      // eslint-disable-next-line @typescript-eslint/ban-types
      ...jest.requireActual<Object>('which'),
      sync: (): boolean => false,
    }));

    // When
    const result = require('./get-chrome-path').getChromePath();

    // Then
    expect(result).toBe('google-chrome');
  });

  test('should return an error when platform is unknown', (): void => {
    // Given
    jest.mock('os', (): unknown => ({
      // eslint-disable-next-line @typescript-eslint/ban-types
      ...jest.requireActual<Object>('os'),
      type: (): string => 'foo',
    }));

    // When
    // Then
    const expectedError = new Error(
      'Error: you should supply the path to the Chrome App in the launch options',
    );
    expect((): string => require('./get-chrome-path').getChromePath()).toThrow(expectedError);
  });
});
