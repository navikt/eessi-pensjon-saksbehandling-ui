/* global it */

const _ = require('./common');
const $ = require('./constants');

it('Waiting until login page loads', async function () {

    await _.elementLoads('#idToken1');
    await _.elementLoads('#idToken2');
    await _.elementLoads('#loginButton_0');
});

it('Filling username', async function () {

    let loginBox = await _.getElement('#idToken1');

    _.expect(loginBox).to.not.equal(null);

    await loginBox.sendKeys($.login.username);

    _.expect(await loginBox.getAttribute('value')).to.equal($.login.username);
});

it('Filling password', async function () {

    let passwordBox = await _.getElement('#idToken2');

    _.expect(passwordBox).to.not.equal(null);

    await passwordBox.sendKeys($.login.password);

    _.expect(await passwordBox.getAttribute('value')).to.equal($.login.password);
});


it('Submitting login form...', async function () {

    let submitButton = await _.getElement('#loginButton_0');
    await submitButton.click();
});
