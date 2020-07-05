/* eslint-disable @typescript-eslint/no-var-requires */
describe('get-firefox-path', (): void => {
  afterEach((): void => {
    jest.resetModules();
  });
  test('should return default windows path on Windows platform', (): void => {
    // Given
    jest.mock('os', (): unknown => ({
      ...jest.requireActual('os'),
      type: (): string => 'Windows_NT',
    }));

    // When
    const result = require('./get-firefox-path').getFirefoxPath();

    // Then
    expect(result).toBe('C:/Program Files (x86)/Mozilla Firefox/firefox.exe');
  });

  test('should return default MacOS path on MAcOS platform', (): void => {
    // Given
    jest.mock('os', (): unknown => ({
      ...jest.requireActual('os'),
      type: (): string => 'Darwin',
    }));

    // When
    const result = require('./get-firefox-path').getFirefoxPath();

    // Then
    expect(result).toBe('/Applications/Firefox.app/Contents/MacOS/firefox');
  });

  test('should return default Unix path on Unix platform for firefox latest install', (): void => {
    // Given
    jest.mock('os', (): unknown => ({
      ...jest.requireActual('os'),
      type: (): string => 'Linux',
    }));
    jest.mock('which', (): unknown => ({
      ...jest.requireActual('which'),
      sync: (): string => '/home/travis/firefox-latest/firefox/firefox',
    }));

    // WHen
    const result = require('./get-firefox-path').getFirefoxPath();

    // Then
    expect(result).toBe('/home/travis/firefox-latest/firefox/firefox');
  });

  test('should return default Unix path on Unix platform for firefox install', (): void => {
    // Given
    jest.mock('os', (): unknown => ({
      ...jest.requireActual('os'),
      type: (): string => 'Linux',
    }));
    jest.mock('which', (): unknown => ({
      ...jest.requireActual('which'),
      sync: (): boolean => false,
    }));

    // When
    const result = require('./get-firefox-path').getFirefoxPath();

    // Then
    expect(result).toBe('firefox');
  });

  test('should return an error when platform is unknown', (): void => {
    // Given
    jest.mock('os', (): unknown => ({
      ...jest.requireActual('os'),
      type: (): string => 'foo',
    }));

    // When
    // Then
    const expectedError = new Error(
      'Error: you should supply the path to the Firefox App in the launch options',
    );
    expect((): string => require('./get-firefox-path').getFirefoxPath()).toThrow(expectedError);
  });
});
