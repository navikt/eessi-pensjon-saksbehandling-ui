const {Given, When, Then} = require('cucumber');
const _ = require('../support/world').instance;

Given(/^at jeg er på nettsiden med elementen '(.*)'$/, async function (_class) {
    await _.elementLoads(_class);
    let el = await _.getElements(_class);
    _.expect(el).to.have.length(1);
});

Then(/^jeg får nettsiden med( uten)? elementen '(.*)'$/, async function (uten, _class) {
    await _.elementLoads(_class);
    let el = await _.getElements(_class);
    if (uten) {
        _.expect(el).to.have.length(0);
    } else {
        _.expect(el).to.have.length(1);
    }
});

When(/^jeg trykk på '(.*)' knapp$/, async function (value) {
    await _.elementLoads('button.' + value);
    let button = await _.getElement('button.' + value);
    await button.click();
})

Then(/^jeg får nettsiden med advarsel '(.*)'$/, async function (advarsel) {
    await _.elementLoads('.alertstripe__tekst');
    let alertStripe = await _.getElement('.alertstripe__tekst');
    let text = await alertStripe.getText();
    _.expect(text).to.be.equal(advarsel);
});
