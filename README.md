# puppeteer-core-controller

fluent API around puppeteer-core (WIP)

[![Build Status](https://travis-ci.org/hdorgeval/puppeteer-core-controller.svg?branch=master)](https://travis-ci.org/hdorgeval/puppeteer-core-controller)

- Usage

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
