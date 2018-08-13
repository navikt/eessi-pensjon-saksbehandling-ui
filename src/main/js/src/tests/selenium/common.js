


exports.

async function handleLoginPage() {

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
}

async function  handleFrontPage () {

    let link, languageSelector, englishOption, bokmalOption, nynorskOption;

    it('Waiting until FrontPage loads...', async function () {

        await driver.wait(until.elementLocated(By.css('.frontPageLink')));
        await driver.wait(until.elementLocated(By.css('select.skjemaelement__input')));
        link = await driver.findElement(By.css(this.suiteContext.frontPageButtonClass));
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

    it('Forwarding to page...', async function () {
        link.click();
    });
}

module.exports = {
  handleLoginPage,
  handleFrontPage
}
