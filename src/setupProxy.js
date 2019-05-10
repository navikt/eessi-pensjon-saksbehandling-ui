const proxy = require('http-proxy-middleware')

module.exports = function (app) {
   app.use(proxy('/frontend', {'target': 'http://localhost:8080'}))
   app.use(proxy('/fagmodul', {'target': 'http://localhost:8081'}))
}
