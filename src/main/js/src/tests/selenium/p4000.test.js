/* global describe, before, after, it */

const _ = require('./common/common');
const $ = require('./common/constants');

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
    describe('Get P4000 file page', () => {

        let fileButton, newP4000Button, openP4000Button, viewP4000Button, newEventButton, saveP4000Button, submitP4000Button;

        let workButton, homeButton, childButton, voluntaryButton, militaryButton;
        let birthButton, learnButton, dailyButton, sickButton, otherButton;
        let viewButton, saveButton, sendButton;

        it('Waiting until P4000 file loads...', async function () {

            await _.driver.wait(_.elementLoads('button.newP4000Button'));
            fileButton = await _.getElement('.fileButton');
            newP4000Button = await _.getElement('.newP4000Button');
            openP4000Button = await _.getElement('.openP4000Button');
            viewP4000Button = await _.getElement('.viewP4000Button');
            newEventButton = await _.getElement('.newEventButton');
            saveP4000Button = await _.getElement('.saveP4000Button');
            submitP4000Button = await _.getElement('.submitP4000Button');
            _.expect(!(await fileButton.isEnabled()));
            _.expect(await newP4000Button.isEnabled());
            _.expect(await openP4000Button.isEnabled());
            _.expect(!(await viewP4000Button.isEnabled()));
            _.expect(!(await newEventButton.isEnabled()));
            _.expect(!(await saveP4000Button.isEnabled()));
            _.expect(!(await submitP4000Button.isEnabled()));
        });

        it('Create a new P4000 ...', async function () {

            newP4000Button.click();
            _.expect(await fileButton.isEnabled());

            await _.driver.wait(_.elementLoads('.newEventPanel'));
            workButton = await _.getElement('.workButton');
            homeButton = await _.getElement('.homeButton');
            childButton = await _.getElement('.childButton');
            voluntaryButton = await _.getElement('.voluntaryButton');
            militaryButton = await _.getElement('.militaryButton');
            birthButton = await _.getElement('.birthButton');
            learnButton = await _.getElement('.learnButton');
            dailyButton = await _.getElement('.dailyButton');
            sickButton = await _.getElement('.sickButton');
            otherButton = await _.getElement('.otherButton');

            viewButton = await _.getElement('.viewButton');
            saveButton = await _.getElement('.saveButton');
            sendButton = await _.getElement('.sendButton');

            _.expect(!(await viewButton.isEnabled()));
            _.expect(await saveButton.isEnabled());
            _.expect(await sendButton.isEnabled());
        });

    });

    after(function(done) {

        //   _.driver.quit()
        //       .then(() => done());
    });
});
