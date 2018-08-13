/* global describe, before, after, it */

const _ = require('./common');

it('Waiting until login page loads', async function () {

  await _.driver.wait(_.until.elementLocated(_.By.css('#idToken1')));
  await _.driver.wait(_.until.elementLocated(_.By.css('#idToken2')));
  await _.driver.wait(_.until.elementLocated(_.By.css('#loginButton_0')));
});

it('Filling username', async function () {

  let loginBox = await _.driver.findElement(_.By.css('#idToken1'));
  _.expect(loginBox).to.not.equal(null);
  await loginBox.sendKeys(_.params.login.username);
  expect(await loginBox.getAttribute('value')).to.equal(_.params.login.username);
});

it('Filling password', async function () {

  let passwordBox = await _.driver.findElement(_.By.css('#idToken2'));
  _.expect(passwordBox).to.not.equal(null);
  await passwordBox.sendKeys(_.params.login.password);
  expect(await passwordBox.getAttribute('value')).to.equal(_.params.login.password);
});


it('Submitting login form...', async function () {
  let submitButton = await _.driver.findElement(_.By.css('#loginButton_0'));
  await submitButton.click();
});
