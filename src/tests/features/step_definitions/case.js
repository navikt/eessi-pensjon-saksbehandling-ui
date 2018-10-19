const {Given, When, Then} = require('cucumber');
const { World } = require('../../common/world');

var _ = new World({
   user: {
       srvPensjon: {
        'username' : 'srvPensjon',
        'password' : 'Ash5SoxP'
       }
   },
   caseId  : '123',
   actorId : '1000060964183',
    frontPageButtonClass: '.caseLink',
    frontPageButtonText: {
        en: 'Create new case',
        nb: 'Opprett ny sak'
    }
});

Given(/^I navigate to the ([^\W]+) url$/, function (env, next) {
    _.driver.navigate().to(_.urls[env])
      .then(next);
});

Given(/^I login as ([^\W]+)$/, async function (user) {

    await _.elementLoads('.loginButton');
    let loginButton = await _.getElement('.loginButton');

    await loginButton.click();
    await _.elementLoads('#idToken1');
    await _.elementLoads('#idToken2');
    await _.elementLoads('#loginButton_0');

    let loginBox = await _.getElement('#idToken1');
    _.expect(loginBox).to.not.equal(null);
    let _user = _.params.user[user].username;
    await loginBox.sendKeys(_user.username);
    _.expect(await loginBox.getAttribute('value')).to.equal(_user.username);
});

/*it('Filling password', async function () {

    let passwordBox = await _.getElement('#idToken2');

    _.expect(passwordBox).to.not.equal(null);

    await passwordBox.sendKeys($.login.password);

    _.expect(await passwordBox.getAttribute('value')).to.equal($.login.password);
});


it('Submitting login form...', async function () {

    let submitButton = await _.getElement('#loginButton_0');
    await submitButton.click();
});*/



Then(/^I submit$/, function (next) {
    var self = this;
    _.driver.findElement({ name: 'btnG' })
      .click()
      .then(function() {
        self.driver.wait(function () {
          return self.driver.isElementPresent(webdriver.By.id("top_nav"));
        }, 5000);
        next();
      });
});

Then(/^I should see title "([^"]*)"$/, function (titleMatch, next) {
    _.driver.getTitle()
      .then(function(title) {
        assert.equal(title, titleMatch, next, 'Expected title to be ' + titleMatch);
      });
});


