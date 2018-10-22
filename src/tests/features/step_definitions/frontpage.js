const {Given, When, Then} = require('cucumber');
const _ = require('../support/world').instance;

Then(/^jeg ser( ikke)? menyalternativ '(.*)'$/, async function (ikke, tekst) {
    let links = await _.getElements(_.params.frontPageButtonClass);
    if (ikke) {
        _.expect(links).to.have.length(0);
    } else {
        _.expect(links).to.have.length(1);
    }
});

Then(/^klikk til menyalternativ '(.*)'$/, async function (tekst) {

    let link = await _.getElement(_.params.frontPageButtonClass);
    _.expect(await link.getText()).to.be.equal(_.params.frontPageButtonText.nb);
    link.click();
});
