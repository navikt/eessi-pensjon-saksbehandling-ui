/* global describe, before, after, it */

const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;
const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-as-promised'));
chai.use(require('chai-string'));

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

const urls = {
    'test' : 'localhost:8080',
    'development' : 'localhost:3000',
    'production' : 'localhost:8080'
};

const params = {
    login: {
        'username' : 'srvPensjon',
        'password' : 'Ash5SoxP'
    }
};

describe('Selenium case submit', () => {

    before(function(done) {
        driver.navigate().to(urls[process.env.NODE_ENV] || 'test')
            .then(() => done())
    });

    ///////// LOGIN PAGE ////////////
    describe('Login page', () => {

        let loginBox, passwordBox, submitButton;

        it('Waiting until login page loads', async function () {

            await driver.wait(until.elementLocated(By.css('#idToken1')));
            await driver.wait(until.elementLocated(By.css('#idToken2')));
            await driver.wait(until.elementLocated(By.css('#loginButton_0')));
        });

        it('Filling username', async function () {

            loginBox = await driver.findElement(By.css('#idToken1'));
            expect(loginBox).to.not.equal(null);
            await loginBox.sendKeys(params.login.username);
            expect(await loginBox.getAttribute('value')).to.equal(params.login.username);
        });

        it('Filling password', async function () {

            passwordBox = await driver.findElement(By.css('#idToken2'));
            expect(passwordBox).to.not.equal(null);
            await passwordBox.sendKeys(params.login.password);
            expect(await passwordBox.getAttribute('value')).to.equal(params.login.password);
        });


        it('Submitting login form...', async function () {
            submitButton = await driver.findElement(By.css('#loginButton_0'));
            await submitButton.click();
        });
    });

    ///////// FRONT PAGE ////////////
    describe('Front page', () => {

        let link, languageSelector, englishOption, bokmalOption, nynorskOption;

        it('Waiting until FrontPage loads...', async function () {

            await driver.wait(until.elementLocated(By.css('.frontPageLink')));
            await driver.wait(until.elementLocated(By.css('select.skjemaelement__input')));
            link = await driver.findElement(By.css('.frontPageLink'));
            languageSelector = await driver.findElement(By.css('select.skjemaelement__input'));
        });

        it('Checking language...', async function () {

            englishOption = await driver.findElement(By.css('option[value="en"]', languageSelector));
            bokmalOption  = await driver.findElement(By.css('option[value="nb"]', languageSelector));
            nynorskOption = await driver.findElement(By.css('option[value="nn"]', languageSelector));

            englishOption.click();
            expect(await link.getText()).to.be.equal('Create new case');

            bokmalOption.click();
            expect(await link.getText()).to.be.equal('Opprett ny saks');

            nynorskOption.click();
            expect(await link.getText()).to.be.equal('NN_Opprett ny saks');
        });

        it('Forwarding to GetCase page...', async function () {

            link.click();
        });
    });

    ///////// GET PAGE ////////////
    describe('Get page', () => {

        let caseId, actorId, forwardButton;

        it('Waiting until GetPage loads...', async function () {

            await driver.wait(until.elementLocated(By.css('.getCaseInputCaseId input[type="text"]')));
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
