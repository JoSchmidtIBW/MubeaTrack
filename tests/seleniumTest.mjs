import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import assert from 'assert';
import { Builder, By, until } from 'selenium-webdriver';
import 'chromedriver';
//---------------funktioniert------------------------------
describe('Test load next site after login', function () {
  it('Should return the URL after admin logged in and show the next site', async function () {
    this.timeout(15000);
    let driver = await new Builder().forBrowser('chrome').build();
    try {
      await driver.get(
        'http://127.0.0.1:' + process.env.DEV_PORT + '/api/v1/login'
      );

      await driver.findElement(By.id('employeeNumber')).sendKeys('70220');
      await sleep(1000);
      await driver.findElement(By.id('password')).sendKeys('test1234');
      await driver.findElement(By.className('btn btn--green')).click();

      await sleep(2000);

      await driver.wait(
        until.urlIs(
          'http://127.0.0.1:' + process.env.DEV_PORT + '/api/v1/overview'
        ),
        5000
      );

      await sleep(3000);

      const currentUrl = await driver.getCurrentUrl();

      assert.strictEqual(
        currentUrl,
        'http://127.0.0.1:' + process.env.DEV_PORT + '/api/v1/overview',
        'URL after login should be: ' + currentUrl
      );
    } finally {
      await driver.quit();
    }
  });
});
//---------------funktioniert------------------------------
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Test, when admin logs in and clicks on his avatar', function () {
  it('Should return his firstname in the list by the page account', async function () {
    this.timeout(15000);
    let driver = await new Builder().forBrowser('chrome').build();
    try {
      await driver.get(
        'http://127.0.0.1:' + process.env.DEV_PORT + '/api/v1/login'
      );

      await driver.findElement(By.id('employeeNumber')).sendKeys('70220');
      //await sleep(1000);
      await driver.findElement(By.id('password')).sendKeys('test1234');
      await driver.findElement(By.className('btn btn--green')).click();

      await sleep(2000);

      await driver.wait(
        until.urlIs(
          'http://127.0.0.1:' + process.env.DEV_PORT + '/api/v1/overview'
        ),
        5000
      );

      await sleep(2000);

      await driver.findElement(By.className('nav__el avatar')).click();

      await sleep(3000);

      await driver.wait(until.elementLocated(By.css('input#firstname')), 5000);
      const firstnameElement = await driver.findElement(
        By.css('input#firstname')
      );
      const strFirstName = await firstnameElement.getAttribute('value');

      assert.strictEqual(
        strFirstName,
        'Admin', // Replace with the expected firstname
        'Firstname should be: ' + strFirstName
      );
    } finally {
      await driver.quit();
    }
  });
});
