const proxy = require('http-proxy-middleware')

module.exports = (app: any) => {
  app.use(proxy('/frontend/', { target: 'http://localhost:8080', pathRewrite: { '^/frontend': '' }, logLevel: 'info' }))
  app.use(proxy('/fagmodul/', { target: 'http://localhost:8081', pathRewrite: { '^/fagmodul': '' }, logLevel: 'info' }))
}
