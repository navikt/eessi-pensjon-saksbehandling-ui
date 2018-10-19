const {Given, When, Then} = require('cucumber');
const _ = require('../support/world').instance;

Given('I open a browser', function (next) {
    _.openBrowser();
    next();
});

Then('I quit the browser', function (next) {
    _.closeBrowser();
    next();
});

When(/^I navigate to the ([^\W]+) url$/, async function (env) {
    await _.driver.navigate().to(_.urls[env]);
});
