/* global describe, before, after, it */

const _ = require('./common/common');

describe('Selenium PDF create', () => {

    before(function(done) {

        this.suiteContext = {
            name: 'pdf',
            frontPageButtonClass: '.pdfLink'
        };

        _.driver.navigate().to(
            _.urls[process.env.NODE_ENV] || 'test')
         .then(() => done())
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
    describe('Get select PDF page', () => {

        let forwardButton, fileUpload;

        it('Waiting until selectPDF loads...', async function () {

            await _.driver.wait(_.until.elementLocated(_.By.css('.nav-fileUpload')));
            await _.driver.wait(_.until.elementLocated(_.By.css('button.forwardButton')));
            await _.driver.wait(_.until.elementLocated(_.By.css('.nav-fileUpload .dropzone')));
            forwardButton = await _.driver.findElement(_.By.css('button.forwardButton'));
            _.expect(!(await forwardButton.isEnabled()));
        });

        it('Upload file', async function () {

            let fileUpload = await _.driver.findElement(_.By.css('.nav-fileUpload .dropzone'));
            fileUpload.click();
          //  await caseId.sendKeys('notvalid');
          //  expect(await forwardButton.isEnabled());
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
