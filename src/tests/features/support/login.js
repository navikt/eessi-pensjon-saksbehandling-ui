var login = async function (_, user) {

    await _.elementLoads('.loginButton');
    let loginButton = await _.getElement('.loginButton');

    await loginButton.click();
    await _.elementLoads('#idToken1');
    await _.elementLoads('#idToken2');
    await _.elementLoads('#loginButton_0');

    let _user = _.params.user[user];

    let loginBox = await _.getElement('#idToken1');
    _.expect(loginBox).to.not.equal(null);
    await loginBox.sendKeys(_user.username);
    _.expect(await loginBox.getAttribute('value')).to.equal(_user.username);

    let passwordBox = await _.getElement('#idToken2');
    _.expect(passwordBox).to.not.equal(null);
    await passwordBox.sendKeys(_user.password);
    _.expect(await passwordBox.getAttribute('value')).to.equal(_user.password);

    let submitButton = await _.getElement('#loginButton_0');
    await submitButton.click();
    await _.elementLoads('.appTitle');
};

module.exports = {
   login
}
