const {Given, When, Then} = require('cucumber');
const _ = require('../support/world').instance;

Given('sett opp P4000 parametere', function (next) {

   _.setParams({
       'user': {
           'srvPensjon': {
              'username' : 'srvPensjon',
              'password' : 'Ash5SoxP'
           },
           'Z990511': {
             'username' : 'Z990511',
             'password' : 'Password01'
           }
       },
       frontPageButtonClass: '.p4000Link',
       frontPageButtonText: {
            en: 'Start new P4000',
            nb: 'Begynner ny P4000'
       }
   });
   next();
});
