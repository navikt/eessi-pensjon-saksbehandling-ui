const {Given, When, Then} = require('cucumber');
const { World } = require('../support/world');
const { login } = require('../support/login');

var _ = new World({
   user: {
       srvPensjon: {
          'username' : 'srvPensjon',
          'password' : 'Ash5SoxP'
       },
       Z990511: {
         'username' : 'Z990511',
         'password' : 'Password01'
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

When(/^I navigate to the ([^\W]+) url$/, async function (env) {
    await _.driver.navigate().to(_.urls[env]);
});

When(/^I login as ([^\W]+)$/, async function (user) {
    await login(_, user);
});

Then(/^I ([^\s]+) see the case menu option$/, async function (verb) {
    let links = await _.getElements(_.params.frontPageButtonClass);
    if (verb === 'do') {
        _.expect(links).to.have.length(1);
    } else {
        _.expect(links).to.have.length(0);
    }
});

Given('I open a browser', function (next) {
    _.openBrowser();
    next();
});

Then('I quit the browser', function (next) {
    _.closeBrowser();
    next();
});

