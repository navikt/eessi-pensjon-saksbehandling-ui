const { When } = require('cucumber')
const _ = require('../support/world').instance
const { login } = require('../support/login')

When(/^jeg logg inn som '([^\W]+)'$/, async function (user) {
  await login(_, user)
})
