const { Given, When, Then } = require('cucumber')
const _ = require('../support/world').instance

Given('at jeg åpen nettleseren', function (next) {
  _.openBrowser()
  next()
})

Then('jeg lukker nettleseren', function (next) {
  _.closeBrowser()
  next()
})

When(/^jeg besøker ([^\W]+) nettsiden/, async function (env) {
  await _.driver.navigate().to(_.urls[env])
})
