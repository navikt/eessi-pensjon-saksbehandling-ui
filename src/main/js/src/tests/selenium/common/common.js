/* global describe, before, after, it */

const webdriver = require('selenium-webdriver');
const chai = require('chai');

chai.use(require('chai-as-promised'));
chai.use(require('chai-string'));

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

const urls = {
    'test' : 'localhost:8080',
    'development' : 'localhost:3000',
    'production' : 'localhost:8080'
};

const params = {
    login: {
        'username' : 'srvPensjon',
        'password' : 'Ash5SoxP'
    },
    caseId  : '123',
    actorId : '1000027223724'
};

exports.chai = chai;
exports.assert = chai.assert;
exports.driver = driver;
exports.expect = chai.expect;
exports.urls = urls;
exports.until = webdriver.until;
exports.By = webdriver.By;
exports.params = params;
