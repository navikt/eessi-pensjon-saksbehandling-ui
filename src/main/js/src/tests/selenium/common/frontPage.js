/* global it */

const _ = require('./common');
const $ = require('./constants');

it('Waiting until FrontPage loads...', async function () {

    await _.elementLoads($[this.suiteContext].frontPageButtonClass);
    await _.elementLoads('select.skjemaelement__input');
});

it('Checking language...', async function () {

    let languageSelector = await _.getElement('select.skjemaelement__input');
    let link             = await _.getElement($[this.suiteContext].frontPageButtonClass);

    let englishOption = await _.getElement('option[value="en"]', languageSelector);
    let bokmalOption  = await _.getElement('option[value="nb"]', languageSelector);

    englishOption.click();

    _.expect(await link.getText()).to.be.equal($[this.suiteContext].frontPageButtonText.en);

    bokmalOption.click();

    _.expect(await link.getText()).to.be.equal($[this.suiteContext].frontPageButtonText.nb);
});

it('Forwarding to page...', async function () {

    let link  = await _.getElement($[this.suiteContext].frontPageButtonClass);
    link.click();
});

