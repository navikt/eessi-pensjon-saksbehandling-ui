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

        let newP4000Button, openP4000Button, viewP4000Button, newEventButton, saveP4000Button, submitP4000Button;

        it('Waiting until P4000 file loads...', async function () {

            await _.driver.wait(_.elementLoads('button.newP4000Button'));
            newP4000Button = await _.driver.getElement('.newP4000Button');
            openP4000Button = await _.driver.getElement('.openP4000Button');
            viewP4000Button = await _.driver.getElement('.viewP4000Button');
            newEventButton = await _.driver.getElement('.newEventButton');
            saveP4000Button = await _.driver.getElement('.saveP4000Button');
            submitP4000Button = await _.driver.getElement('.submitP4000Button');
            expect(await newP4000Button.isEnabled());
            expect(await openP4000Button.isEnabled());
            expect(await viewP4000Button.isEnabled());
            expect(await newEventButton.isEnabled());
            expect(await saveP4000Button.isEnabled());
            expect(await submitP4000Button.isEnabled());
        });
    });

    after(function(done) {

        _.driver.quit()
            .then(() => done());
    });
});
