const express = require("express");
const path = require("path");
const { createProxyMiddleware } = require('http-proxy-middleware');


const enforceAzureADMiddleware = async function(req, res, next) {

  const loginUrl = process.env.EESSI_PENSJON_FRONTEND_API_FSS_URL + '/oauth2/login?redirect=' +
    process.env.EESSI_PENSJON_FRONTEND_API_FSS_URL + '/logincallback?redirect=' + encodeURI(req.originalUrl)

  const {authorization} = req.headers;

// Not logged in - log in with wonderwall
  if (!authorization) {
    console.log("no authorization - login to " + loginUrl);
    res.redirect(loginUrl);
  } else {
    // Validate token and continue to app
    if(await validateAuthorization(authorization)) {
      next();
    } else {
      console.log("no authorization - login to " + loginUrl);
      res.redirect(loginPath);
    }
  }
}

const validateAuthorization = async (authorization) => {
  try {
    const token = authorization.split(" ")[1];
    return !!token
  } catch (e) {
    LogError('azure ad error', e);
    return false;
  }
}

const app = express();
app.disable("x-powered-by");

app.get('/test', (req, res) => res.send('hello world'));
app.get('/internal/isAlive|isReady', (req, res) => res.sendStatus(200));
// Enforce Azure AD authentication
app.use('/frontend', enforceAzureADMiddleware);
app.use('/fagmodul', enforceAzureADMiddleware);
app.use('/frontend', createProxyMiddleware( {target: process.env.EESSI_PENSJON_FRONTEND_API_FSS_URL, changeOrigin: true}))
app.use('/fagmodul', createProxyMiddleware( {target: process.env.EESSI_PENSJON_FAGMODUL_URL, changeOrigin: true}))
app.use('/static', express.static(path.join(__dirname, "build", "static")));
app.use('/locales', express.static(path.join(__dirname, "build", "locales")));
app.use('/favicon', express.static(path.join(__dirname, "build", "favicon")));
app.use('*', enforceAzureADMiddleware);
app.use('*', express.static(path.join(__dirname, "build")));

// start express server on port 8080
app.listen(8080, () => {
  console.log("server started on port 8080");
});
