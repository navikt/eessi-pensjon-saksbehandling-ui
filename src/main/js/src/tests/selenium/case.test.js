/* global describe, before, after, it */

const _ = require('./common/common');

describe('Selenium case submit', () => {

    before(function(done) {

        this.suiteContext = {
            name: 'case',
            frontPageButtonClass: '.caseLink'
        };

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

            await _.driver.wait(_.until.elementLocated(_.By.css('.getCaseInputCaseId input[type="text"]')));
            await _.driver.wait(_.until.elementLocated(_.By.css('.getCaseInputActorId input[type="text"]')));
            await _.driver.wait(_.until.elementLocated(_.By.css('button.forwardButton')));
            caseId = await _.driver.findElement(_.By.css('.getCaseInputCaseId input[type="text"]'));
            actorId = await _.driver.findElement(_.By.css('.getCaseInputActorId input[type="text"]'));
            forwardButton = await _.driver.findElement(_.By.css('button.forwardButton'));
            _.expect(!(await forwardButton.isEnabled()));
        });

        it('Fill up invalid case...', async function () {

            await caseId.sendKeys('notvalid');
            await actorId.sendKeys('notvalid');
            _.expect(await forwardButton.isEnabled());
        });

        it('Submitting invalid case...', async function () {

            await forwardButton.click();
            await _.driver.wait(_.until.elementLocated(_.By.css('div.alertstripe')));
            await _.driver.wait(_.until.elementLocated(_.By.css('.getCaseInputCaseId')));
            caseId = await _.driver.findElement(_.By.css('.getCaseInputCaseId input[type="text"]'));
            actorId = await _.driver.findElement(_.By.css('.getCaseInputActorId input[type="text"]'));

            let alertStripe = await _.driver.findElement(_.By.css('div.alertstripe .alertstripe__tekst'));
            _.expect(await alertStripe.getText()).to.be.equal('asdfvalidCaseNumber');
        });

        it('Filling up valid case...', async function () {

            await caseId.clear();
            await caseId.sendKeys(_.params.caseId);

            await actorId.clear();
            await actorId.sendKeys(_.params.actorId);

            _.expect(await forwardButton.isEnabled());
        });

        it('Submitting valid case...', async function () {

            await forwardButton.click();
        });
    });

    ///////// EDIT PAGE ////////////
    describe('Edit page', () => {

        let forwardButton, institutionButton, alertStripe, subjectareaList, pensjonOption;
        let bucList, buc01Option, sedList, p2000Option, countryList, noOption, institutionList, i0001Option;

        it('Waiting for EditCase to load...', async function () {

            await _.driver.wait(_.until.elementLocated(_.By.css('div.subjectAreaList select option[value="Pensjon"]')))
            await _.driver.wait(_.until.elementLocated(_.By.css('div.bucList select option[value="P_BUC_01"]')));
            await _.driver.wait(_.until.elementLocated(_.By.css('div.sedList')));
            await _.driver.wait(_.until.elementLocated(_.By.css('div.countryList select option[value="NO"]')));
            await _.driver.wait(_.until.elementLocated(_.By.css('div.institutionList select option[value="0001"]')));
            await _.driver.wait(_.until.elementLocated(_.By.css('button.forwardButton')));
            await _.driver.wait(_.until.elementLocated(_.By.css('button.createInstitutionButton')));

            forwardButton = await _.driver.findElement(_.By.css('button.forwardButton'));
            institutionButton = await _.driver.findElement(_.By.css('button.createInstitutionButton'));
        });

        it('Checking alert message...', async function () {
            alertStripe = await _.driver.findElement(_.By.css('div.alertstripe .alertstripe__tekst'));
            _.expect(await alertStripe.getText()).to.be.equal('NN_Saken funnet: 123');
                    console.log("xxx5");
        });

        it('Selecting subject area...', async function () {

            subjectareaList = await _.driver.findElement(_.By.css('div.subjectAreaList select'));
            pensjonOption = await _.driver.findElement(_.By.css('option[value="Pensjon"]', subjectareaList));
            await pensjonOption.click();
        });

        it('Selecting BUC...', async function () {

            bucList = await _.driver.findElement(_.By.css('div.bucList select'));
            buc01Option = await _.driver.findElement(_.By.css('option[value="P_BUC_01"]', bucList));
            await buc01Option.click();
        });

        it('Selecting SED...', async function () {

            await _.driver.wait(_.until.elementLocated(_.By.css('div.sedList select option[value="P2000"]')))
            sedList = await _.driver.findElement(_.By.css('div.sedList select'));
            p2000Option = await _.driver.findElement(_.By.css('option[value="P2000"]', sedList));
            await p2000Option.click();
            _.expect(!(await forwardButton.isEnabled()));
        });

        it('Selecting country...', async function () {

            countryList = await _.driver.findElement(_.By.css('div.countryList select'));
            noOption = await _.driver.findElement(_.By.css('option[value="NO"]', countryList));
            await noOption.click();
        });

        it('Selecting institution...', async function () {

            institutionList = await _.driver.findElement(_.By.css('div.institutionList select'));
            await _.driver.wait(_.until.elementLocated(_.By.css('div.institutionList select option[value="NAVT001"]')));
            i0001Option = await _.driver.findElement(_.By.css('option[value="NAVT001"]', institutionList));
            _.expect(!(await institutionButton.isEnabled()));
            await i0001Option.click();
            _.expect(await institutionButton.isEnabled());
        });

        it('Adding an institution...', async function () {

            _.expect(!(await forwardButton.isEnabled()));
            await institutionButton.click();
            _.expect(await forwardButton.isEnabled());

            await _.driver.wait(_.until.elementLocated(_.By.css('div.renderedInstitutions')));
            let renderedInstitutions = await _.driver.findElement(_.By.css('div.renderedInstitutions'));
            let renderedInstitution =  await _.driver.findElement(_.By.css('div.renderedInstitution'), renderedInstitutions);
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

            await _.driver.wait(_.until.elementLocated(_.By.css('div.confirmData')));
            await _.driver.wait(_.until.elementLocated(_.By.css('button.backButton')));
            await _.driver.wait(_.until.elementLocated(_.By.css('button.forwardButton')));
        });

        it('Checking ConfirmPage content...', async function () {

            forwardButton = await _.driver.findElement(_.By.css('button.forwardButton'));
            let confirmData = await _.driver.findElement(_.By.css('div.confirmData'));
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

            await _.driver.wait(_.until.elementLocated(_.By.css('div.generateData')));
            await _.driver.wait(_.until.elementLocated(_.By.css('button.backButton')));
            await _.driver.wait(_.until.elementLocated(_.By.css('button.forwardButton')));
        });

        it('Checking GeneratePage content...', async function () {

            forwardButton = await _.driver.findElement(_.By.css('button.forwardButton'));
            let generateData = await _.driver.findElement(_.By.css('div.generateData'));
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

            await _.driver.wait(_.until.elementLocated(_.By.css('div.alertstripe')));
            await _.driver.wait(_.until.elementLocated(_.By.css('div.endCase a')));
            await _.driver.wait(_.until.elementLocated(_.By.css('button.forwardButton')));
        });

        it('Confirming alert stripe for end case...', async function () {

            let alertStripe = await _.driver.findElement(_.By.css('div.alertstripe .alertstripe__tekst'));
            _.expect(await alertStripe.getText()).to.be.equal('NN_Data sendt');
        });

        it('Confirming link...', async function () {

            let endCase = await _.driver.findElement(_.By.css('div.endCase'));
            let link = await _.driver.findElement(_.By.css('a', endCase));
            let href = await link.getAttribute('href');
            console.log(href);
            _.expect(href).to.startsWith('http://rina-oppl-utv004.adeo.no/portal/#/caseManagement/');
        });

        it('Forwarding to new case..', async function () {

            let forwardButton = await _.driver.findElement(_.By.css('button.forwardButton'));
            await forwardButton.click();
        });

        it('Loading getCase..', async function () {

            await _.driver.wait(_.until.elementLocated(_.By.css('.getCaseInputCaseId input[type="text"]')));
            await _.driver.wait(_.until.elementLocated(_.By.css('.getCaseInputActorId input[type="text"]')));
            await _.driver.wait(_.until.elementLocated(_.By.css('button')));
            caseId = await _.driver.findElement(_.By.css('.getCaseInputCaseId input[type="text"]'));
            actorId = await _.driver.findElement(_.By.css('.getCaseInputActorId input[type="text"]'));
            let forwardButton = await _.driver.findElement(_.By.css('button.forwardButton'));
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
