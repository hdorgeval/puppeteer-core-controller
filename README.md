# puppeteer-core-controller
fluent API around puppeteer-core (WIP)

* Usage

```js
import { PuppeteerController } from 'puppeteer-core-controller';

const pptc = new PuppeteerController();

await pptc
    .initWith({
      headless: false,
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
     })
    .withMaxSizeWindow()
    .navigateTo('https://devexpress.github.io/testcafe/example')
    .close();

```
