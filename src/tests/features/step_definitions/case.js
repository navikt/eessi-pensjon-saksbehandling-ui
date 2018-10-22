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

Given(/^at jeg er på nettsiden med class '(.*)'$/, async function (_class) {
    await _.elementLoads(_class);
    let divs = await _.getElements(_class);
    _.expect(divs).to.have.length(1);
});

Given(/^nettsiden '(.*)' er klar$/, async function (_class) {
    await _.elementLoads('.getCaseInputCaseId input[type="text"]');
    await _.elementLoads('.getCaseInputActorId input[type="text"]');
    await _.elementLoads('.getCaseInputRinaId input[type="text"]');
    await _.elementLoads('button.forwardButton');
});

When(/^jeg fyller ut ugyldig informasjon$/, async function () {
    caseId        = await _.getElement('.getCaseInputCaseId input[type="text"]');
    actorId       = await _.getElement('.getCaseInputActorId input[type="text"]');
    rinaId        = await _.getElement('.getCaseInputRinaId input[type="text"]');
    await caseId.sendKeys('notvalid');
    await actorId.sendKeys('notvalid');
    await rinaId.sendKeys('notvalid');
});

When(/^jeg fyller ut gyldig informasjon$/, async function () {
    caseId        = await _.getElement('.getCaseInputCaseId input[type="text"]');
    actorId       = await _.getElement('.getCaseInputActorId input[type="text"]');
    rinaId        = await _.getElement('.getCaseInputRinaId input[type="text"]');
    await caseId.clear();
    await caseId.sendKeys(_.params.caseId);
    await actorId.clear();
    await actorId.sendKeys(_.params.actorId);
});

When(/^jeg trykk fremover knapp$/, async function () {
    let forwardButton = await _.getElement('button.forwardButton');
    await forwardButton.click();
})

Then(/^jeg får nettsiden med advarsel '(.*)'$/, async function (advarsel) {
    await _.elementLoads('.alertstripe__tekst');
    let alertStripe = await _.getElement('.alertstripe__tekst');
    let text = await alertStripe.getText();
    _.expect(text).to.be.equal(advarsel);
});

Then(/^jeg får nettsiden med class '(.*)'$/, async function (_class) {
    await _.elementLoads(_class);
    let divs = await _.getElements(_class);
    _.expect(divs).to.have.length(1);
});

When(/^jeg velger fagområde '(.*)'$/, async function (value) {
    await _.elementLoads('div.subjectAreaList select');
    let subjectAreaList = await _.getElement('div.subjectAreaList select');
    await _.elementLoads('option[value="' + value + '"]', subjectAreaList);
    let option   = await _.getElement('option[value="' + value + '"]', subjectAreaList);
    await option.click();
})

When(/^jeg velger BUC '(.*)'$/, async function (value) {
    await _.elementLoads('div.bucList select');
    let bucList     = await _.getElement('div.bucList select');
    await _.elementLoads('option[value="' + value + '"]', bucList);
    let option = await _.getElement('option[value="' + value + '"]', bucList);
    await option.click();
});

When(/^jeg velger SED '(.*)'$/, async function (value) {
    await _.elementLoads('div.sedList select');
    let sedList     = await _.getElement('div.sedList select');
    await _.elementLoads('option[value="' + value + '"]', sedList);
    let option = await _.getElement('option[value="' + value + '"]', sedList);
    await option.click();
});

When(/^jeg velger land '(.*)'$/, async function (value) {
    await _.elementLoads('.countrySelect');
    let countryList = await _.getElement('.countrySelect');
    await countryList.click();
    await _.elementLoads('div.CountrySelect__menu-list div[role="option"] > img[alt="' + value + '"]');
    let options = await _.getElement('div.CountrySelect__menu-list div[role="option"] > img[alt="' + value + '"]');
    options.click();
});

When(/^jeg velger mottager '(.*)'$/, async function (value) {
    await _.elementLoads('div.institutionList select');
    await _.elementLoads('button.createInstitutionButton');
    let institutionButton = await _.getElement('button.createInstitutionButton');
    let institutionList = await _.getElement('div.institutionList select');
    await _.elementLoads('option[value="' + value + '"]', institutionList);
    let i0001Option     = await _.getElement('option[value="' + value + '"]', institutionList);
    _.expect(!(await institutionButton.isEnabled()));
    await i0001Option.click();
    _.expect(await institutionButton.isEnabled());
});


When(/^jeg legg til mottager '(.*)'$/, async function (value) {

    await _.elementLoads('button.createInstitutionButton');
    let institutionButton = await _.getElement('button.createInstitutionButton');
    await institutionButton.click();

    await _.elementLoads('div.renderedInstitutions');
    let renderedInstitutions = await _.getElement('div.renderedInstitutions');
    let renderedInstitution =  await _.getElement('div.renderedInstitution', renderedInstitutions);
    _.expect(renderedInstitution).to.not.equal(null);
    _.expect(await renderedInstitution.getText()).to.be.equal(value);
});

Then(/^forvent at framover knapp er '(.*)'$/, async function (status) {
    let forwardButton = await _.getElement('button.forwardButton');
    if (status === 'slått av') {
        _.expect(!(await forwardButton.isEnabled()));
    }
    if (status === 'slått på') {
        _.expect(await forwardButton.isEnabled());
    }
});

Given(/^at nettsiden 'Registrerer sak' er klar$/, async function (status) {
    await _.elementLoads('div.c-case-renderConfirmData');
    let confirmData = await _.getElement('div.c-case-renderConfirmData');
    _.expect(confirmData).to.not.equal(null);
});

Given(/^at nettsiden 'Genererer sak' er klar$/, async function (status) {
    await _.elementLoads('div.c-case-renderGeneratedData');
    let confirmData = await _.getElement('div.c-case-renderGeneratedData');
    _.expect(confirmData).to.not.equal(null);
});

Given(/^at nettsiden 'Lagre sak' er klar$/, async function (status) {
    await _.elementLoads('div.c-case-saveCase a');
    let alertStripe = await _.getElement('div.alertstripe .alertstripe__tekst');
    _.expect(await alertStripe.getText()).to.be.equal('Data sendt');

    let saveCase = await _.getElement('div.saveCase');
    let link     = await _.getElement('a', saveCase);
    let href     = await link.getAttribute('href');
    console.log(href);
    _.expect(href).to.startsWith('http://rina-oppl-utv004.adeo.no/portal/_/caseManagement/');
});

Given(/^at nettsiden 'Sendt sak' er klar$/, async function (status) {
    await _.elementLoads('div.c-case-sendCase');
});
