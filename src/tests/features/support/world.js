const webdriver = require('selenium-webdriver');
const chai = require('chai');

chai.use(require('chai-as-promised'));
chai.use(require('chai-string'));

class World {

    constructor() {

        this.setParams = function (params) {
            this.params = params;
        }

        this.driver = null;

        this.openBrowser = function () {
            this.driver = new webdriver.Builder()
              .forBrowser('chrome')
              .build();
        }

        this.closeBrowser = function () {
            this.driver.quit();
        }

        this.urls = {
            'test'        : 'https://eessi-pensjon-frontend-ui.nais.preprod.local',
            'development' : 'https://eessi-pensjon-frontend-ui.nais.preprod.local',
            'production'  : 'https://eessi-pensjon-frontend-ui.nais.preprod.local'
        };

        this.elementLoads = async function (cssPattern, parentEl) {
            return await this.driver.wait(webdriver.until.elementLocated(webdriver.By.css(cssPattern, parentEl)));
        }

        this.getElement = async function (cssPattern, parentEl) {
            return await this.driver.findElement(webdriver.By.css(cssPattern, parentEl));
        }

        this.getElements = async function (cssPattern, parentEl) {
            return await this.driver.findElements(webdriver.By.css(cssPattern, parentEl));
        }

        this.assert  = chai.assert;
        this.expect  = chai.expect;
    }
}

var instance = new World();

module.exports = {
   instance
}
