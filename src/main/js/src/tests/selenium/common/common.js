const webdriver = require('selenium-webdriver');
const chai = require('chai');

chai.use(require('chai-as-promised'));
chai.use(require('chai-string'));

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

const urls = {
    'test'        : 'localhost:8080',
    'development' : 'localhost:3000',
    'production'  : 'localhost:8080'
};

let elementLoads = async function (cssPattern) {
    return await driver.wait(webdriver.until.elementLocated(webdriver.By.css(cssPattern)));
}

let getElement = async function (cssPattern, parentEl) {
    return await driver.findElement(webdriver.By.css(cssPattern, parentEl));
}

module.exports = {
    assert : chai.assert,
    driver : driver,
    expect : chai.expect,
    urls   : urls,
    elementLoads : elementLoads,
    getElement   : getElement

}
