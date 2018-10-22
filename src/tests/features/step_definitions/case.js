const {Given, When, Then} = require('cucumber');
const _ = require('../support/world').instance;
const { login } = require('../support/login');

Given('sett opp saks parametere', function (next) {

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




