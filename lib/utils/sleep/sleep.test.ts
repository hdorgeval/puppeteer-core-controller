import * as SUT from './index';

describe('sleep N milliseconds', (): void => {
  test('should wait', async (): Promise<void> => {
    // Given
    const wait = 3000;
    const startTime = new Date().getTime();

    // When
    await SUT.sleep(wait);
    const endTime = new Date().getTime();

    // Then
    const duration = endTime - startTime;
    expect(Math.abs(duration - wait)).toBeLessThan(20);
  });
});
