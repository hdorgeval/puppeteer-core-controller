# puppeteer-core-controller

fluent API around puppeteer-core (WIP)

[![Build Status](https://travis-ci.org/hdorgeval/puppeteer-core-controller.svg?branch=master)](https://travis-ci.org/hdorgeval/puppeteer-core-controller)
[![Build status](https://ci.appveyor.com/api/projects/status/5q3m4m4s62knhb72?svg=true)](https://ci.appveyor.com/project/hdorgeval/puppeteer-core-controller)

- Usage

```js
import { PuppeteerController } from 'puppeteer-core-controller';

const pptc = new PuppeteerController();
const checkMeOutSelector = 'input[type="checkbox"].form-check-input';

await pptc
  .initWith({
    headless: false,
  })
  .withMaxSizeWindow()
  .navigateTo('https://reactstrap.github.io/components/form/')
  .click(checkMeOutSelector)
  .close();
```
