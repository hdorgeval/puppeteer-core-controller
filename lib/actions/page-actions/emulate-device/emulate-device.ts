import * as puppeteer from 'puppeteer-core';
import { DeviceName } from './device-names';
import { allKnownDevices } from './device-descriptors';

export async function emulateDevice(
  deviceName: DeviceName,
  page: puppeteer.Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(
      `Error: cannot emulate device '${deviceName}' because a new page has not been created`,
    );
  }

  const device = require('puppeteer-core').devices[deviceName];
  await page.emulate(device);
}

export function getDevice(deviceName: DeviceName): puppeteer.devices.Device | undefined {
  const device = allKnownDevices.filter((d) => d.name === deviceName).shift();
  return device;
}
