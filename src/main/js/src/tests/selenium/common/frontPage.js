/* global describe, before, after, it */

const _ = require('./common');

it('Waiting until FrontPage loads...', async function () {

    console.log(this.suiteContext)
    await _.driver.wait(_.until.elementLocated(_.By.css(this.suiteContext.frontPageButtonClass)));
    await _.driver.wait(_.until.elementLocated(_.By.css('select.skjemaelement__input')));
});

it('Checking language...', async function () {

    let languageSelector = await _.driver.findElement(_.By.css('select.skjemaelement__input'));

    let englishOption = await _.driver.findElement(_.By.css('option[value="en"]', languageSelector));
    let bokmalOption  = await _.driver.findElement(_.By.css('option[value="nb"]', languageSelector));

    englishOption.click();
    expect(await link.getText()).to.be.equal('Create new case');

    bokmalOption.click();
    expect(await link.getText()).to.be.equal('Opprett ny saks');
});

it('Forwarding to page...', async function () {
    let link = await _.driver.findElement(By.css(this.suiteContext.frontPageButtonClass));
    link.click();
});

