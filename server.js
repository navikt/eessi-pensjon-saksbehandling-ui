const express = require("express");
const path = require("path");
const { createProxyMiddleware } = require('http-proxy-middleware');

var frontendProxy = createProxyMiddleware('/frontend', {target: 'https://eessi-pensjon-frontend-api-fss-q2.dev.intern.nav.no/'});
var fagmodulProxy = createProxyMiddleware('/fagmodul', {target: 'https://eessi-pensjon-fagmodul-q2.dev.intern.nav.no/'});

const app = express();
app.disable("x-powered-by");

app.get('/test', (req, res) => res.send('hello world'));
app.get('/internal/isAlive|isReady', (req, res) => res.sendStatus(200));
app.use(frontendProxy)
app.use(fagmodulProxy)
app.use('/', express.static(path.join(__dirname, "build")));

// start express server on port 8080
app.listen(8080, () => {
  console.log("server started on port 8080");
});
