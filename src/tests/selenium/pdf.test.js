/* global describe, before, after, it */

const _ = require('./common/common')

describe('Selenium PDF create', () => {
  before(function (done) {
    this.suiteContext = 'pdf'

    _.driver.navigate().to(
      _.urls[process.env.NODE_ENV] || 'test')
      .then(() => done())
  })

  /// ////// LOGIN PAGE ////////////

  describe('Login page', () => {
    require('./common/loginPage')
  })

  /// ////// FRONT PAGE ////////////
  describe('Front page', () => {
    require('./common/frontPage')
  })

  /// ////// GET PAGE ////////////
  describe('Get select PDF page', () => {
    let forwardButton, fileUpload

    it('Waiting until selectPDF loads...', async function () {
      await _.elementLoads('.nav-fileUpload')
      await _.elementLoads('button.forwardButton')
      await _.elementLoads('.nav-fileUpload .dropzone')
      forwardButton = await _.getElement('button.forwardButton')

      _.expect(!(await forwardButton.isEnabled()))
    })

    it('Upload file', async function () {
      fileUpload = await _.getElement('.nav-fileUpload .dropzone')
      fileUpload.click()

      // it should load files from joark
    })
  })

  after(function (done) {
    _.driver.quit().then(() => done())
  })
})

/* let dump = function (driver, done) {
    driver.getPageSource().then((source) => {
        console.log(source)
        if (done) {done()}
    });
} */
