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

            await _.driver.wait(until.elementLocated(By.css('.getCaseInputCaseId input[type="text"]')));
            await driver.wait(until.elementLocated(By.css('.getCaseInputActorId input[type="text"]')));
            await driver.wait(until.elementLocated(By.css('button.forwardButton')));
            caseId = await driver.findElement(By.css('.getCaseInputCaseId input[type="text"]'));
            actorId = await driver.findElement(By.css('.getCaseInputActorId input[type="text"]'));
            forwardButton = await driver.findElement(By.css('button.forwardButton'));
            expect(!(await forwardButton.isEnabled()));
        });

        it('Fill up invalid case...', async function () {

            await caseId.sendKeys('notvalid');
            expect(await forwardButton.isEnabled());
        });

        it('Submitting invalid case...', async function () {

            await forwardButton.click();
            await driver.wait(until.elementLocated(By.css('div.alertstripe')));
            await driver.wait(until.elementLocated(By.css('.getCaseInputCaseId')));
            caseId = await driver.findElement(By.css('.getCaseInputCaseId input[type="text"]'));

            let alertStripe = await driver.findElement(By.css('div.alertstripe .alertstripe__tekst'));
            expect(await alertStripe.getText()).to.be.equal('asdfvalidCaseNumber');
        });

        it('Filling up valid case...', async function () {

            await caseId.clear();
            await caseId.sendKeys('123');

            await actorId.clear();
            await actorId.sendKeys('456');

            expect(await forwardButton.isEnabled());
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

            await driver.wait(until.elementLocated(By.css('div.alertstripe')));
            await driver.wait(until.elementLocated(By.css('div.subjectAreaList select option[value="Pensjon"]')))
            await driver.wait(until.elementLocated(By.css('div.bucList select option[value="P_BUC_01"]')));
            await driver.wait(until.elementLocated(By.css('div.sedList')));
            await driver.wait(until.elementLocated(By.css('div.countryList select option[value="NO"]')));
            await driver.wait(until.elementLocated(By.css('div.institutionList select option[value="0001"]')));
            await driver.wait(until.elementLocated(By.css('button.forwardButton')));
            await driver.wait(until.elementLocated(By.css('button.createInstitutionButton')));

            forwardButton = await driver.findElement(By.css('button.forwardButton'));
            institutionButton = await driver.findElement(By.css('button.createInstitutionButton'));
        });

        it('Checking alert message...', async function () {

            alertStripe = await driver.findElement(By.css('div.alertstripe .alertstripe__tekst'));
            expect(await alertStripe.getText()).to.be.equal('NN_Saken funnet: 123');
        });

        it('Selecting subject area...', async function () {

            subjectareaList = await driver.findElement(By.css('div.subjectAreaList select'));
            pensjonOption = await driver.findElement(By.css('option[value="Pensjon"]', subjectareaList));
            await pensjonOption.click();
        });

        it('Selecting BUC...', async function () {

            bucList = await driver.findElement(By.css('div.bucList select'));
            buc01Option = await driver.findElement(By.css('option[value="P_BUC_01"]', bucList));
            await buc01Option.click();
        });

        it('Selecting SED...', async function () {

            await driver.wait(until.elementLocated(By.css('div.sedList select option[value="P2000"]')))
            sedList = await driver.findElement(By.css('div.sedList select'));
            p2000Option = await driver.findElement(By.css('option[value="P2000"]', sedList));
            await p2000Option.click();
            expect(!(await forwardButton.isEnabled()));
        });

        it('Selecting country...', async function () {

            countryList = await driver.findElement(By.css('div.countryList select'));
            noOption = await driver.findElement(By.css('option[value="NO"]', countryList));
            await noOption.click();
        });

        it('Selecting institution...', async function () {

            institutionList = await driver.findElement(By.css('div.institutionList select'));
            await driver.wait(until.elementLocated(By.css('div.institutionList select option[value="NAVT001"]')));
            i0001Option = await driver.findElement(By.css('option[value="NAVT001"]', institutionList));
            expect(!(await institutionButton.isEnabled()));
            await i0001Option.click();
            expect(await institutionButton.isEnabled());
        });

        it('Adding an institution...', async function () {

            expect(!(await forwardButton.isEnabled()));
            await institutionButton.click();
            expect(await forwardButton.isEnabled());

            await driver.wait(until.elementLocated(By.css('div.renderedInstitutions')));
            let renderedInstitutions = await driver.findElement(By.css('div.renderedInstitutions'));
            let renderedInstitution =  await driver.findElement(By.css('div.renderedInstitution'), renderedInstitutions);
            expect(renderedInstitution).to.not.equal(null);
            expect(await renderedInstitution.getText()).to.be.equal('NO/NAVT001');
        });

        it('Clicking forward button...', async function () {

            await forwardButton.click();
        });
    });

    ///////// CONFIRM PAGE ////////////
    describe('Confirm page', () => {

        let forwardButton;

        it('Waiting for ConfirmPage to load...', async function () {

            await driver.wait(until.elementLocated(By.css('div.confirmData')));
            await driver.wait(until.elementLocated(By.css('button.backButton')));
            await driver.wait(until.elementLocated(By.css('button.forwardButton')));
        });

        it('Checking ConfirmPage content...', async function () {

            forwardButton = await driver.findElement(By.css('button.forwardButton'));
            let confirmData = await driver.findElement(By.css('div.confirmData'));
            expect(confirmData).to.not.equal(null);
        });

        it('Clicking forward button...', async function () {

            expect(await forwardButton.isEnabled());
            await forwardButton.click();
        });
    });

    ///////// GENERATE PAGE ////////////
    describe('Generate page', () => {

        let forwardButton;

        it('Waiting for GeneratePage to load...', async function () {

            await driver.wait(until.elementLocated(By.css('div.generateData')));
            await driver.wait(until.elementLocated(By.css('button.backButton')));
            await driver.wait(until.elementLocated(By.css('button.forwardButton')));
        });

        it('Checking GeneratePage content...', async function () {

            forwardButton = await driver.findElement(By.css('button.forwardButton'));
            let generateData = await driver.findElement(By.css('div.generateData'));
            expect(generateData).to.not.equal(null);
        });

        it('Clicking forward button...', async function () {

            expect(await forwardButton.isEnabled());
            await forwardButton.click();
        });
    });

    ///////// END PAGE ////////////
    describe('End page', () => {

        it('Waiting for EndPage to load...', async function () {

            await driver.wait(until.elementLocated(By.css('div.alertstripe')));
            await driver.wait(until.elementLocated(By.css('div.endCase a')));
            await driver.wait(until.elementLocated(By.css('button.forwardButton')));
        });

        it('Confirming alert stripe for end case...', async function () {

            let alertStripe = await driver.findElement(By.css('div.alertstripe .alertstripe__tekst'));
            expect(await alertStripe.getText()).to.be.equal('NN_Data sendt');
        });

        it('Confirming link...', async function () {

            let endCase = await driver.findElement(By.css('div.endCase'));
            let link = await driver.findElement(By.css('a', endCase));
            let href = await link.getAttribute('href');
            console.log(href);
            expect(href).to.startsWith('http://rina-oppl-utv004.adeo.no/portal/#/caseManagement/');
        });

        it('Forwarding to new case..', async function () {

            let forwardButton = await driver.findElement(By.css('button.forwardButton'));
            await forwardButton.click();
        });

        it('Loading getCase..', async function () {

            await driver.wait(until.elementLocated(By.css('.getCaseInputCaseId input[type="text"]')));
            await driver.wait(until.elementLocated(By.css('.getCaseInputActorId input[type="text"]')));
            await driver.wait(until.elementLocated(By.css('button')));
            caseId = await driver.findElement(By.css('.getCaseInputCaseId input[type="text"]'));
            actorId = await driver.findElement(By.css('.getCaseInputActorId input[type="text"]'));
            let forwardButton = await driver.findElement(By.css('button.forwardButton'));
            expect(!(await forwardButton.isEnabled()));
        });
    });

    after(function(done) {

        driver.quit()
            .then(() => done());
    });
});

/*let dump = function (driver, done) {
    driver.getPageSource().then((source) => {
        console.log(source)
        if (done) {done()}
    });
}*/
