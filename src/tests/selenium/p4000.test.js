/* global describe, before, after, it */

const _ = require('./common/common');
const $ = require('./common/constants');
const path = require('path');

describe('Selenium P4000 page test', () => {

    before(function(done) {

        this.suiteContext = 'p4000';
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
    describe('New P4000 page', () => {

        let fileButton, newP4000Button, openP4000FromFileButton, openP4000FromServerButton;
        let viewP4000Button, newEventButton, saveP4000ToFileButton, saveP4000ToServerButton, submitP4000Button;

        let workButton, homeButton, childButton, voluntaryButton, militaryButton;
        let birthButton, learnButton, dailyButton, sickButton, otherButton;
        let viewButton, saveButton, sendButton;

        it('Waiting until P4000 file loads...', async function () {

            await _.driver.wait(_.elementLoads('button.newP4000Button'));
            fileButton = await _.getElement('.fileButton');
            newP4000Button = await _.getElement('.newP4000Button');
            openP4000FromFileButton = await _.getElement('.openP4000FromFileButton');
            viewP4000Button = await _.getElement('.viewP4000Button');
            newEventButton = await _.getElement('.newEventButton');
            saveP4000ToFileButton = await _.getElement('.saveP4000ToFileButton');
            saveP4000ToServerButton = await _.getElement('.saveP4000ToServerButton');
            submitP4000Button = await _.getElement('.submitP4000Button');
            _.expect(!(await fileButton.isEnabled()));
            _.expect(await newP4000Button.isEnabled());
            _.expect(await openP4000FromFileButton.isEnabled());
            _.expect(await openP4000FromServerButton.isEnabled());
            _.expect(!(await viewP4000Button.isEnabled()));
            _.expect(!(await newEventButton.isEnabled()));
            _.expect(!(await saveP4000ToFileButton.isEnabled()));
            _.expect(!(await saveP4000ToServerButton.isEnabled()));
            _.expect(!(await submitP4000Button.isEnabled()));
        });

        it('Create a new P4000 ...', async function () {

            newP4000Button.click();
            _.expect(await fileButton.isEnabled());

            await _.driver.wait(_.elementLoads('.newEventPanel'));
            workButton = await _.getElement('.workButton');

            viewButton = await _.getElement('.viewButton');
            saveButton = await _.getElement('.saveButton');
            sendButton = await _.getElement('.sendButton');

            _.expect(!(await viewButton.isEnabled()));
            _.expect(await saveButton.isEnabled());
            _.expect(await sendButton.isEnabled());
        });

        it('Create a new work...', async function () {

            await workButton.click();

            await _.driver.wait(_.elementLoads('.eventDescription'));
            let divOnlyToUnfocus = await _.getElement('.eventDescription');

            let startDate = await _.getElement('.startDate');
            let endDate = await _.getElement('.endDate');
            let uncertainDate = await _.getElement('.uncertainDate');
            let activity = await _.getElement('.activity input[type="text"]');
            let id = await _.getElement('.id input[type="text"]');
            let name = await _.getElement('.name input[type="text"]');
            let address = await _.getElement('#address');
            let city = await _.getElement('.city input[type="text"]');
            let region = await _.getElement('.region input[type="text"]');
            let countrySelect = await _.getElement('.countrySelect');
            let other = await _.getElement('#other');
            let saveButton = await _.getElement('.saveButton');

            await startDate.sendKeys('01.01.1970');

            _.expect(!(await uncertainDate.isSelected()));
            await uncertainDate.click();
            _.expect(await uncertainDate.isSelected());

            await endDate.sendKeys('31.12.1970');
            await uncertainDate.click();
            _.expect(!(await uncertainDate.isSelected()));

            await activity.sendKeys('activity');
            await id.sendKeys('id');
            await name.sendKeys('name');
            await address.sendKeys('address');
            await city.sendKeys('city');
            await region.sendKeys('region');

            await countrySelect.click();
            let options = await _.getElement('.Select-option[aria-label="Norge"]', countrySelect);
            options.click();

            await other.sendKeys('other');

            saveButton.click();
        });

        it('Create a new home...', async function () {

            homeButton = await _.getElement('.homeButton');
            await homeButton.click();

            await _.driver.wait(_.elementLoads('.eventDescription'));
            let divOnlyToUnfocus = await _.getElement('.eventDescription');

            let startDate = await _.getElement('.startDate');
            let endDate = await _.getElement('.endDate');
            let uncertainDate = await _.getElement('.uncertainDate');
            let countrySelect = await _.getElement('.countrySelect');
            let other = await _.getElement('#other');
            let saveButton = await _.getElement('.saveButton');

            await divOnlyToUnfocus.click();
            await startDate.sendKeys('01.01.1971');
            await divOnlyToUnfocus.click();
            await endDate.sendKeys('31.12.1971');
            await divOnlyToUnfocus.click();

            await countrySelect.click();
            let options = await _.getElement('.Select-option[aria-label="Norge"]', countrySelect);
            options.click();

            await other.sendKeys('other');

            saveButton.click();
        });

        it('Create a new child...', async function () {

            childButton = await _.getElement('.childButton');
            await childButton.click();

            await _.driver.wait(_.elementLoads('.eventDescription'));
            let divOnlyToUnfocus = await _.getElement('.eventDescription');

            let startDate = await _.getElement('.startDate');
            let endDate = await _.getElement('.endDate');
            let uncertainDate = await _.getElement('.uncertainDate');
            let firstname = await _.getElement('.firstname input[type="text"]');
            let lastname = await _.getElement('.lastname input[type="text"]');
            let birthDate = await _.getElement('.birthDate');
            let countrySelect = await _.getElement('.countrySelect');
            let other = await _.getElement('#other');
            let saveButton = await _.getElement('.saveButton');

            await divOnlyToUnfocus.click();
            await startDate.sendKeys('01.01.1972');
            await divOnlyToUnfocus.click();
            await endDate.sendKeys('31.12.1972');
            await divOnlyToUnfocus.click();

            await firstname.sendKeys('firstname');
            await lastname.sendKeys('lastname');
            await birthDate.sendKeys('02.01.1972');
            await divOnlyToUnfocus.click();

            await countrySelect.click();
            let options = await _.getElement('.Select-option[aria-label="Norge"]', countrySelect);
            options.click();

            await other.sendKeys('other');

            saveButton.click();
        });

        it('Create a new voluntary...', async function () {

            voluntaryButton = await _.getElement('.voluntaryButton');
            await voluntaryButton.click();

            await _.driver.wait(_.elementLoads('.eventDescription'));
            let divOnlyToUnfocus = await _.getElement('.eventDescription');

            let startDate = await _.getElement('.startDate');
            let endDate = await _.getElement('.endDate');
            let uncertainDate = await _.getElement('.uncertainDate');
            let countrySelect = await _.getElement('.countrySelect');
            let other = await _.getElement('#other');
            let saveButton = await _.getElement('.saveButton');

            await divOnlyToUnfocus.click();
            await startDate.sendKeys('01.01.1973');
            await divOnlyToUnfocus.click();
            await endDate.sendKeys('31.12.1973');
            await divOnlyToUnfocus.click();

            await countrySelect.click();
            let options = await _.getElement('.Select-option[aria-label="Norge"]', countrySelect);
            options.click();

            await other.sendKeys('other');

            saveButton.click();
        });

        it('Create a new military...', async function () {

            militaryButton = await _.getElement('.militaryButton');
            await militaryButton.click();

            await _.driver.wait(_.elementLoads('.eventDescription'));
            let divOnlyToUnfocus = await _.getElement('.eventDescription');

            let startDate = await _.getElement('.startDate');
            let endDate = await _.getElement('.endDate');
            let uncertainDate = await _.getElement('.uncertainDate');
            let countrySelect = await _.getElement('.countrySelect');
            let other = await _.getElement('#other');
            let saveButton = await _.getElement('.saveButton');

            await divOnlyToUnfocus.click();
            await startDate.sendKeys('01.01.1974');
            await divOnlyToUnfocus.click();
            await endDate.sendKeys('31.12.1974');
            await divOnlyToUnfocus.click();

            await countrySelect.click();
            let options = await _.getElement('.Select-option[aria-label="Norge"]', countrySelect);
            options.click();

            await other.sendKeys('other');

            saveButton.click();
        });

        it('Create a new birth...', async function () {

            birthButton = await _.getElement('.birthButton');
            await birthButton.click();

            await _.driver.wait(_.elementLoads('.eventDescription'));
            let divOnlyToUnfocus = await _.getElement('.eventDescription');

            let startDate = await _.getElement('.startDate');
            let endDate = await _.getElement('.endDate');
            let uncertainDate = await _.getElement('.uncertainDate');
            let countrySelect = await _.getElement('.countrySelect');
            let other = await _.getElement('#other');
            let saveButton = await _.getElement('.saveButton');

            await divOnlyToUnfocus.click();
            await startDate.sendKeys('01.01.1975');
            await divOnlyToUnfocus.click();
            await endDate.sendKeys('31.12.1975');
            await divOnlyToUnfocus.click();

            await countrySelect.click();
            let options = await _.getElement('.Select-option[aria-label="Norge"]', countrySelect);
            options.click();

            await other.sendKeys('other');

            saveButton.click();
        });

        it('Create a new learn...', async function () {

            learnButton = await _.getElement('.learnButton');
            await learnButton.click();

            await _.driver.wait(_.elementLoads('.eventDescription'));
            let divOnlyToUnfocus = await _.getElement('.eventDescription');

            let startDate = await _.getElement('.startDate');
            let endDate = await _.getElement('.endDate');
            let uncertainDate = await _.getElement('.uncertainDate');
            let name = await _.getElement('.name input[type="text"]');
            let countrySelect = await _.getElement('.countrySelect');
            let other = await _.getElement('#other');
            let saveButton = await _.getElement('.saveButton');

            await divOnlyToUnfocus.click();
            await startDate.sendKeys('01.01.1976');
            await divOnlyToUnfocus.click();
            await endDate.sendKeys('31.12.1976');
            await divOnlyToUnfocus.click();

            await name.sendKeys('name');

            await countrySelect.click();
            let options = await _.getElement('.Select-option[aria-label="Norge"]', countrySelect);
            options.click();

            await other.sendKeys('other');

            saveButton.click();
        });

        it('Create a new daily...', async function () {

            dailyButton = await _.getElement('.dailyButton');
            await dailyButton.click();

            await _.driver.wait(_.elementLoads('.eventDescription'));
            let divOnlyToUnfocus = await _.getElement('.eventDescription');

            let startDate = await _.getElement('.startDate');
            let endDate = await _.getElement('.endDate');
            let uncertainDate = await _.getElement('.uncertainDate');
            let countrySelect = await _.getElement('.countrySelect');
            let other = await _.getElement('#other');
            let saveButton = await _.getElement('.saveButton');

            await divOnlyToUnfocus.click();
            await startDate.sendKeys('01.01.1977');
            await divOnlyToUnfocus.click();
            await endDate.sendKeys('31.12.1977');
            await divOnlyToUnfocus.click();

            await countrySelect.click();
            let options = await _.getElement('.Select-option[aria-label="Norge"]', countrySelect);
            options.click();

            await other.sendKeys('other');

            saveButton.click();
        });

        it('Create a new sick...', async function () {

            sickButton = await _.getElement('.sickButton');
            await sickButton.click();

            await _.driver.wait(_.elementLoads('.eventDescription'));
            let divOnlyToUnfocus = await _.getElement('.eventDescription');

            let startDate = await _.getElement('.startDate');
            let endDate = await _.getElement('.endDate');
            let uncertainDate = await _.getElement('.uncertainDate');
            let countrySelect = await _.getElement('.countrySelect');
            let other = await _.getElement('#other');
            let saveButton = await _.getElement('.saveButton');

            await divOnlyToUnfocus.click();
            await startDate.sendKeys('01.01.1978');
            await divOnlyToUnfocus.click();
            await endDate.sendKeys('31.12.1978');
            await divOnlyToUnfocus.click();

            await countrySelect.click();
            let options = await _.getElement('.Select-option[aria-label="Norge"]', countrySelect);
            options.click();

            await other.sendKeys('other');

            saveButton.click();
        });

        it('Create a new other...', async function () {

            otherButton = await _.getElement('.otherButton');
            await otherButton.click();

            await _.driver.wait(_.elementLoads('.eventDescription'));
            let divOnlyToUnfocus = await _.getElement('.eventDescription');

            let startDate = await _.getElement('.startDate');
            let endDate = await _.getElement('.endDate');
            let uncertainDate = await _.getElement('.uncertainDate');
            let countrySelect = await _.getElement('.countrySelect');
            let other = await _.getElement('#other');
            let saveButton = await _.getElement('.saveButton');

            await divOnlyToUnfocus.click();
            await startDate.sendKeys('01.01.1979');
            await divOnlyToUnfocus.click();
            await endDate.sendKeys('31.12.1979');
            await divOnlyToUnfocus.click();

            await countrySelect.click();
            let options = await _.getElement('.Select-option[aria-label="Norge"]', countrySelect);
            options.click();

            await other.sendKeys('other');

            saveButton.click();
        });

        it('Check the event list...', async function () {

            await _.driver.wait(_.elementLoads('.div-eventList'));
            let eventList = await _.getElement('.div-eventList');

            let events = await _.getElements('.event', eventList);
            _.expect(events).to.have.length(10);
        });
    });

    ///////// VIEW PAGE ////////////
    describe('View P4000 page', () => {

        it('View P4000 events...', async function () {

            let viewButton = await _.getElement('.viewButton');
            await viewButton.click();

            await _.driver.wait(_.elementLoads('.vis-item'));
            let viewItems = await _.getElements('.vis-item');
            _.expect(viewItems).to.have.length(10);

        });

        it('View P4000 advanced options...', async function () {

            await _.driver.wait(_.elementLoads('.row-advanced-view button'));
            let advancedViewButton = await _.getElement('.row-advanced-view button');
            await advancedViewButton.click();

            await _.driver.wait(_.elementLoads('.seeFormDataButton'));
            await _.driver.wait(_.elementLoads('.seeP4000DataButton'));

            let seeFormDataButton = await _.getElement('.seeFormDataButton');
            let seeP4000DataButton = await _.getElement('.seeP4000DataButton');

            await seeFormDataButton.click();
            await seeP4000DataButton.click();

        });
    });

    ///////// OPEN PAGE ////////////
    describe('Open P4000 page', () => {

        it('Click on File button...', async function () {

            await _.driver.wait(_.elementLoads('.fileButton'));
            let fileButton = await _.getElement('.fileButton');
            fileButton.click();
        });

        it('Click on Open button...', async function () {

            await _.driver.wait(_.elementLoads('.openP4000FromFileButton'));
            let openButton = await _.getElement('.openP4000FromFileButton');
            openButton.click();
        });

        it('Handle modal...', async function () {

            await  _.driver.wait(_.elementLoads('.modal-main-button'));
            let modalMainButton = await _.getElement('.modal-main-button');
            await  _.driver.wait(_.elementLoads('.modal-other-button'));
            let modalOtherButton = await _.getElement('.modal-other-button');
            modalOtherButton.click();

        });

        it('Upload p4000 file...', async function () {

            let hiddenFileInputOutput = await _.getElement('.hiddenFileInputOutput');
            hiddenFileInputOutput.sendKeys(path.resolve('./src/tests/selenium/files/p4000.json'));
        });

        it('Check loaded file...', async function () {

            await _.driver.wait(_.elementLoads('.div-eventList'));
            let eventList = await _.getElement('.div-eventList');

            let events = await _.getElements('.event', eventList);
            _.expect(events).to.have.length(11);

        });
    });

    ///////// SAVE PAGE ////////////
    describe('Save P4000 page', () => {

        it('Click on File button...', async function () {

            await _.driver.wait(_.elementLoads('.fileButton'));
            let fileButton = await _.getElement('.fileButton');
            fileButton.click();
        });

        it('Click on Save button...', async function () {

            await _.driver.wait(_.elementLoads('.saveP4000ToFileButton'));
            let saveButton = await _.getElement('.saveP4000FoFileButton');
            saveButton.click();
        });

    });

    after(function(done) {

        _.driver.quit()
            .then(() => done());
    });
});
