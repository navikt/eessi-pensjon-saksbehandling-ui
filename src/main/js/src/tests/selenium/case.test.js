/* global describe, before, after, it */

const _ = require('./common/common');
const $ = require('./common/constants');

describe('Selenium case submit', () => {

    before(function(done) {

        this.suiteContext = 'case';
        _.driver.navigate().to(
            _.urls[process.env.NODE_ENV] || 'test'
        ).then(() => done())
    });

    ///////// LOGIN PAGE ////////////

    describe('Login page', () => {
        require('./common/loginPage');
    });

    ///////// FRONT PAGE ////////////
    describe('Front page', () => {
        require('./common/frontPage');
    });

    ///////// GET PAGE ////////////
    describe('Get page', () => {

        let caseId, actorId, forwardButton;

        it('Waiting until GetPage loads...', async function () {

            await _.elementLoads('.getCaseInputCaseId input[type="text"]');
            await _.elementLoads('.getCaseInputActorId input[type="text"]');
            await _.elementLoads('.getCaseInputRinaId input[type="text"]');
            await _.elementLoads('button.forwardButton');
            caseId        = await _.getElement('.getCaseInputCaseId input[type="text"]');
            actorId       = await _.getElement('.getCaseInputActorId input[type="text"]');
            rinaId        = await _.getElement('.getCaseInputRinaId input[type="text"]');
            forwardButton = await _.getElement('button.forwardButton');

            _.expect(!(await forwardButton.isEnabled()));
        });

        it('Fill up invalid case...', async function () {

            await caseId.sendKeys('notvalid');
            await actorId.sendKeys('notvalid');
            await rinaId.sendKeys('notvalid');

            _.expect(await forwardButton.isEnabled());
        });

        it('Submitting invalid case...', async function () {

            await forwardButton.click();
            await _.elementLoads('div.alertstripe');
            let alertStripe = await _.getElement('div.alertstripe .alertstripe__tekst');

            _.expect(await alertStripe.getText()).to.be.equal('invalidCase');
        });

        it('Filling up valid case...', async function () {

            await caseId.clear();
            await caseId.sendKeys($.case.caseId);
            await actorId.clear();
            await actorId.sendKeys($.case.actorId);
            await rinaId.clear();
            await rinaId.sendKeys($.case.rinaId);

            _.expect(await forwardButton.isEnabled());
        });

        it('Submitting valid case...', async function () {

            await forwardButton.click();
        });
    });

    ///////// EDIT PAGE ////////////
    describe('Edit page', () => {

        let forwardButton, institutionButton;

        it('Waiting for EditCase to load...', async function () {

            await _.elementLoads('div.subjectAreaList select option[value="Pensjon"]');
            await _.elementLoads('div.bucList select option[value="P_BUC_01"]');
            await _.elementLoads('div.sedList');
            await _.elementLoads('div.countryList select option[value="NO"]');
            await _.elementLoads('div.institutionList select option[value="0001"]');
            await _.elementLoads('button.forwardButton');
            await _.elementLoads('button.createInstitutionButton');

            forwardButton     = await _.getElement('button.forwardButton');
            institutionButton = await _.getElement('button.createInstitutionButton');

            _.expect(!(await forwardButton.isEnabled()));
        });

        it('Checking alert message...', async function () {

            let alertStripe = await _.getElement('div.alertstripe .alertstripe__tekst');

            _.expect(await alertStripe.getText()).to.be.equal('NN_Saken funnet: 123');
        });

        it('Selecting subject area...', async function () {

            let subjectareaList = await _.getElement('div.subjectAreaList select');
            let pensjonOption   = await _.getElement('option[value="Pensjon"]', subjectareaList);
            await pensjonOption.click();
        });

        it('Selecting BUC...', async function () {

            let bucList     = await _.getElement('div.bucList select');
            let buc01Option = await _.getElement('option[value="P_BUC_01"]', bucList);
            await buc01Option.click();
        });

        it('Selecting SED...', async function () {

            await _.elementLoads('div.sedList select option[value="P2000"]');
            let sedList     = await _.getElement('div.sedList select');
            let p2000Option = await _.getElement('option[value="P2000"]', sedList);
            await p2000Option.click();

            _.expect(!(await forwardButton.isEnabled()));
        });

        it('Selecting country...', async function () {

            let countryList = await _.getElement('div.countryList select');
            let noOption    = await _.getElement('option[value="NO"]', countryList);
            await noOption.click();
        });

        it('Selecting institution...', async function () {

            let institutionList = await _.getElement('div.institutionList select');
            let i0001Option     = await _.getElement('option[value="NAVT001"]', institutionList);
            await _.elementLoads('div.institutionList select option[value="NAVT001"]');

            _.expect(!(await institutionButton.isEnabled()));

            await i0001Option.click();

            _.expect(await institutionButton.isEnabled());
        });

        it('Adding an institution...', async function () {

            _.expect(!(await forwardButton.isEnabled()));

            await institutionButton.click();

            _.expect(await forwardButton.isEnabled());

            await _.elementLoads('div.renderedInstitutions');
            let renderedInstitutions = await _.getElement('div.renderedInstitutions');
            let renderedInstitution =  await _.getElement('div.renderedInstitution', renderedInstitutions);
            _.expect(renderedInstitution).to.not.equal(null);
            _.expect(await renderedInstitution.getText()).to.be.equal('NO/NAVT001');
        });

        it('Clicking forward button...', async function () {

            await forwardButton.click();
        });
    });

    ///////// CONFIRM PAGE ////////////
    describe('Confirm page', () => {

        let forwardButton;

        it('Waiting for ConfirmPage to load...', async function () {

            await _.elementLoads('div.confirmData');
            await _.elementLoads('button.backButton');
            await _.elementLoads('button.forwardButton');
        });

        it('Checking ConfirmPage content...', async function () {

            forwardButton = await _.getElement('button.forwardButton');
            let confirmData = await _.getElement('div.confirmData');

            _.expect(confirmData).to.not.equal(null);
        });

        it('Clicking forward button...', async function () {

            _.expect(await forwardButton.isEnabled());

            await forwardButton.click();
        });
    });

    ///////// GENERATE PAGE ////////////
    describe('Generate page', () => {

        let forwardButton;

        it('Waiting for GeneratePage to load...', async function () {

            await _.elementLoads('div.generateData');
            await _.elementLoads('button.backButton');
            await _.elementLoads('button.forwardButton');
        });

        it('Checking GeneratePage content...', async function () {

            forwardButton    = await _.getElement('button.forwardButton');
            let generateData = await _.getElement('div.generateData');

            _.expect(generateData).to.not.equal(null);
        });

        it('Clicking forward button...', async function () {

            _.expect(await forwardButton.isEnabled());

            await forwardButton.click();
        });
    });

    ///////// END PAGE ////////////
    describe('End page', () => {

        it('Waiting for EndPage to load...', async function () {

            await _.elementLoads('div.alertstripe');
            await _.elementLoads('div.endCase a');
            await _.elementLoads('button.forwardButton');
        });

        it('Confirming alert stripe for end case...', async function () {

            let alertStripe = await _.getElement('div.alertstripe .alertstripe__tekst');

            _.expect(await alertStripe.getText()).to.be.equal('Data sendt');
        });

        it('Confirming link...', async function () {

            let endCase = await _.getElement('div.endCase');
            let link    = await _.getElement('a', endCase);
            let href    = await link.getAttribute('href');
            console.log(href);

            _.expect(href).to.startsWith('http://rina-oppl-utv004.adeo.no/portal/#/caseManagement/');
        });

        it('Forwarding to new case..', async function () {

            let forwardButton = await _.getElement('button.forwardButton');
            await forwardButton.click();
        });

        it('Loading getCase..', async function () {

            await _.elementLoads('.getCaseInputCaseId input[type="text"]');
            await _.elementLoads('.getCaseInputActorId input[type="text"]');
            await _.elementLoads('button');
            let forwardButton = await _.getElement('button.forwardButton');

            _.expect(!(await forwardButton.isEnabled()));
        });
    });

    after(function(done) {

        _.driver.quit()
            .then(() => done());
    });
});

/*let dump = function (driver, done) {
    driver.getPageSource().then((source) => {
        console.log(source)
        if (done) {done()}
    });
}*/
