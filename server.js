const express = require('express')
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express();
app.disable("x-powered-by");

app.get('/test', (req, res) => res.send('hello world'));
app.get('/internal/isAlive|isReady|metrics', (req, res) => res.sendStatus(200));

app.use('/static', express.static(path.join(__dirname, "build", "static")));
app.use('/locales', express.static(path.join(__dirname, "build", "locales")));
app.use('/favicon', express.static(path.join(__dirname, "build", "favicon")));

app.use('/frontend', createProxyMiddleware( {
  target: process.env.EESSI_PENSJON_FRONTEND_API_FSS_URL,
  logLevel: 'debug',
  changeOrigin: true,
  pathRewrite:  { '^/frontend' : '/' },
  onProxyReq(proxyReq, req, res) {
    // add custom header to request
    console.log('on frontend proxy')
    // or log the req
  }}))
app.use('/fagmodul', createProxyMiddleware( {
  target: process.env.EESSI_PENSJON_FAGMODUL_URL,
  logLevel: 'debug',
  changeOrigin: true,
  pathRewrite:  { '^/fagmodul' : '/' },
  onProxyReq(proxyReq, req, res) {
    // add custom header to request
    console.log('on fagmodul proxy')
    // or log the req
  }}))
app.use('*', express.static(path.join(__dirname, "build")));

// start express server on port 8080
app.listen(8080, () => {
  console.log("server started on port 8080");
});
