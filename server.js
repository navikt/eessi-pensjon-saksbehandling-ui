const express = require('express')
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')
const cookieParser = require('cookie-parser')

const onProxyReq = function (proxyReq, req, res) {
  console.log("adding a auth header to proky request");
  proxyReq.setHeader(
    "Authorization",
    "yup-you-are-logged-in"
  )
}

const enforceAzureADMiddleware = async function(req, res, next) {

  const callbackUrl = 'https://' + req.host + req.originalUrl
  const loginUrl = process.env.EESSI_PENSJON_FRONTEND_API_FSS_URL + '/oauth2/login?redirect=' +
    process.env.EESSI_PENSJON_FRONTEND_API_FSS_URL + '/logincallback?redirect=' + encodeURI(callbackUrl)

// Not logged in - log in with wonderwall
  if (!req.headers.authorization) {
    console.log("no authorization - login to " + loginUrl);
    res.redirect(loginUrl);
  } else {
    next();
  }
}

const app = express();
app.disable("x-powered-by");
app.use(cookieParser());

app.get('/test', (req, res) => res.send('hello world'));
app.get('/internal/isAlive|isReady|metrics', (req, res) => res.sendStatus(200));
// Enforce Azure AD authentication
app.use('/frontend', enforceAzureADMiddleware);
app.use('/fagmodul', enforceAzureADMiddleware);
app.use('/frontend', createProxyMiddleware( {target: process.env.EESSI_PENSJON_FRONTEND_API_FSS_URL, changeOrigin: true, onProxyReq: onProxyReq}))
app.use('/fagmodul', createProxyMiddleware( {target: process.env.EESSI_PENSJON_FAGMODUL_URL, changeOrigin: true, onProxyReq: onProxyReq}))
app.use('/static', express.static(path.join(__dirname, "build", "static")));
app.use('/locales', express.static(path.join(__dirname, "build", "locales")));
app.use('/favicon', express.static(path.join(__dirname, "build", "favicon")));
app.use('*', enforceAzureADMiddleware);
app.use('*', express.static(path.join(__dirname, "build")));

// start express server on port 8080
app.listen(8080, () => {
  console.log("server started on port 8080");
});
