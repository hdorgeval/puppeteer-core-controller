import * as os from 'os';
import * as which from 'which';

const currentPlatformType = os.type();

export function getFirefoxPath(): string {
  switch (currentPlatformType) {
    case 'Darwin':
      return '/Applications/Firefox.app/Contents/MacOS/firefox';

    case 'Windows_NT':
      return 'C:/Program Files (x86)/Mozilla Firefox/firefox.exe';

    case 'Linux':
      if (which.sync('firefox')) {
        return which.sync('firefox');
      }

      return 'firefox';

    default:
      throw new Error('Error: you should supply the path to the Firefox App in the launch options');
  }
}
