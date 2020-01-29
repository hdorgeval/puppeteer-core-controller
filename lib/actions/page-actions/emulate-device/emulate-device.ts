import * as puppeteer from 'puppeteer-core';
import { DeviceName } from './device-names';
import { allKnownDevices } from './device-descriptors';

export type Device = puppeteer.devices.Device;
export async function emulateDevice(
  device: Device,
  page: puppeteer.Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(
      `Error: cannot emulate device '${device.name}' because a new page has not been created`,
    );
  }

  await page.emulate(device);
}

export function getDevice(deviceName: DeviceName): Device | undefined {
  const device = allKnownDevices.filter((d) => d.name === deviceName).shift();
  return device;
}

export const defaultDevice: Device = {
  name: 'iPhone X landscape',
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
  viewport: {
    width: 812,
    height: 375,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    isLandscape: true,
  },
};
