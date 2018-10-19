const {Given, When, Then} = require('cucumber');
const _ = require('../support/world').instance;
const { login } = require('../support/login');



Given('set up case params', function (next) {

   _.setParams({
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
   next();
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


