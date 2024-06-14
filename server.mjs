import express from 'express'
import path from 'path'
import { createProxyMiddleware } from 'http-proxy-middleware'
import winston from 'winston'
import fetch from 'cross-fetch'
import { URLSearchParams } from 'url'
import { Issuer } from 'openid-client'
import * as jose from 'jose';
import timeout from 'connect-timeout';

import { fileURLToPath } from 'url';

const app = express();
console.log("Start of app section")
app.use(timeout('60s'));
app.disable("x-powered-by");

const azureAdConfig = {
  clientId: process.env.AZURE_APP_CLIENT_ID,
  clientSecret: process.env.AZURE_APP_CLIENT_SECRET,
  tokenEndpoint: process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT
};

let _issuer
let _remoteJWKSet

const onBehalfOf = function(scope, assertion) {
  console.log("Start of onBehalfOf")
  const params = new URLSearchParams();
  params.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  params.append("client_id", azureAdConfig.clientId);
  params.append("client_secret", azureAdConfig.clientSecret);
  params.append("scope", scope);
  params.append("assertion", assertion);
  params.append("requested_token_use", "on_behalf_of");
  console.log("onBehalfOf before return")
  return fetch(azureAdConfig.tokenEndpoint, {
    body: params,
    method: "POST"
  });
}

const logger = winston.createLogger({
  transports: new winston.transports.Console({
    level: "info",
    handleExceptions: true,
    colorize: false,
  }),
  exitOnError: false,
});

async function validerToken(token) {
  console.log("Start of validerToken")
  return jose.jwtVerify(token, await jwks(), {
    issuer: (await issuer()).metadata.issuer,
  });
}

async function jwks() {
  console.log("VITE_AZURE_OPENID_CONFIG_JWKS_URI: " + process.env.AZURE_OPENID_CONFIG_JWKS_URI);
  if (typeof _remoteJWKSet === "undefined") {
    console.log("insided jwks() undefined if")
    _remoteJWKSet = jose.createRemoteJWKSet(new URL(process.env.AZURE_OPENID_CONFIG_JWKS_URI));
  }

  return _remoteJWKSet;
}

async function issuer() {
  console.log("inside issuer")
  if (typeof _issuer === "undefined") {
    if (!process.env.AZURE_APP_WELL_KNOWN_URL)
      throw new Error(`Miljøvariabelen "AZURE_APP_WELL_KNOWN_URL" må være satt`);
    _issuer = await Issuer.discover(process.env.AZURE_APP_WELL_KNOWN_URL);
  }
  return _issuer;
}

const validateAuthorization = async (authorization) => {
  console.log("inside validateAuthorization")
  try {
    const token = authorization.split(" ")[1];
    const JWTVerifyResult = await validerToken(token);
    return !!JWTVerifyResult?.payload;
  } catch (e) {
    logger.error('azure ad error', e);
    return false;
  }
}

const mainPageAuth = async function(req, res, next) {
  console.log("inside mainPageAuth")
  const {sakId, aktoerId, vedtakId, kravId, saksNr, sakType, avdodFnr} = req.query
  const newPath =
    (aktoerId !== undefined && aktoerId !== '' ? aktoerId : '-') + '/' +
    (sakId !== undefined && sakId !== '' ? sakId : ( saksNr !== undefined &&  saksNr !== '' ? saksNr : '-')) + '/' +
    (kravId !== undefined && kravId !== '' ? kravId : '-') + '/' +
    (vedtakId !== undefined && vedtakId !== '' ? vedtakId :  '-') + '/' +
    (sakType !== undefined && sakType !== '' ? sakType :  '-') + '/' +
    (avdodFnr !== undefined && avdodFnr !== '' ? avdodFnr :  '-') + '/'

  const gjenny = req.originalUrl.indexOf('gjenny') > 0 ? 'GJENNY': '-' + '/'

  const loginPath = '/oauth2/login?redirect=/callback/' + newPath + gjenny
  logger.debug('mainPageAuth: loginPath = ' + loginPath)
  console.log("mainPageAuth: loginPath = " + loginPath)
  const {authorization} = req.headers

  // Not logged in - log in with wonderwall
  if (!authorization) {
    logger.debug ('mainPageAuth: no auth, redirect to login ' + loginPath)
    console.log("mainPageAuth: no auth, redirect to login" + loginPath)
    res.redirect(loginPath)
  } else {
    // Validate token and continue to app
    if(await validateAuthorization(authorization)) {
      console.log("Inside validateAuthorization")
      next();
    } else {
      logger.debug('mainPageAuth: auth Invalid, 302 to login ' + loginPath)
      res.redirect(loginPath)
    }
  }
}

const handleCallback = (req, res) => {
  console.log("Inside handleCallback")
  let paths = req.originalUrl.split('/')
  // /callback/123/456/789/012/Uføretrygd/ => ['', 'callback', '123', '456', '789', '012', 'Uføretrygd']
  let aktoerId = (paths[2] === '-' ? '' : paths[2])
  let sakId = (paths[3] === '-' ? '' : paths[3])
  let kravId = (paths[4] === '-' ? '' : paths[4])
  let vedtakId = (paths[5] === '-' ? '' : paths[5])
  let sakType = (paths[6] === '-' ? '' : paths[6])
  let avdodFnr = (paths[7] === '-' ? '' : paths[7])

  let redirectPath = "/"
  if(aktoerId !== "" && sakId !== ""){
    console.log("Under redirectPath if condition 1")
    redirectPath = '/?aktoerId=' +  aktoerId  + '&sakId=' + sakId
  }

  if(aktoerId !== "" && sakId !== "" && sakType !== ""){
    console.log("Under redirectPath if condition 2")
    redirectPath = redirectPath + "&sakType=" + sakType
  }
  if(aktoerId !== "" && sakId !== "" && kravId !== ""){
    console.log("Under redirectPath if condition 3")
    redirectPath = redirectPath + "&kravId=" + kravId
  }
  if(aktoerId !== "" && sakId !== "" && vedtakId !== ""){
    console.log("Under redirectPath if condition 4")
    redirectPath = redirectPath + "&vedtakId=" + vedtakId
  }


  if(paths[8] === 'GJENNY'){
    if(aktoerId !== "" && sakId !== "" && sakType !== "" && avdodFnr !== ""){
      redirectPath = '/gjenny/?aktoerId=' +  aktoerId  + '&sakId=' + sakId + '&sakType=' + sakType + '&avdodFnr=' + avdodFnr
    } else {
      redirectPath = '/gjenny/'
    }
  }

  //logger.debug('handleCallback: redirecting to ' + redirectPath)
  logger.debug('handleCallback: redirecting to redirect path')
  console.log('handleCallback: redirecting to ' + redirectPath)
  res.redirect(redirectPath)
}

// require token
const apiAuth = function (scope) {
  console.log("Inside apiAuth")
  return async function (req, res, next) {
    if (!req.headers.authorization) {
      logger.debug('redirecting to /oauth2/login')
      console.log('redirecting to /oauth2/login')
      res.redirect("/oauth2/login");
    } else {
      try {
        //logger.debug('apiAuth: trying onBehalfOf with ' + req.headers.authorization)
        const response = await onBehalfOf(
          scope,
          req.headers.authorization.substring("Bearer ".length)
        );
        const body = await response.json();
        //logger.debug('apiAuth: got ' + body.access_token)
        if (response.ok) {
          console.log('response is ok')
          res.locals.on_behalf_of_authorization = "Bearer " + body.access_token;
          next();
        } else {
          console.log("Error fetching on behalf of token. Status code " + response.status)
          logger.error(
            "Error fetching on behalf of token. Status code " + response.status
          );
          logger.error(body.error_description);
          logger.error(body);
          res.redirect("/oauth2/login");
        }
      } catch (error) {
        console.log("Error message " + error.message)
        logger.error(error.message);
        res.redirect("/oauth2/login");
      }
    }
  }
}

const apiProxy = function (target, pathRewrite) {
  //logger.debug('On apiProxy, with target ' + target)
  console.log("Inside apiProxy")
  return createProxyMiddleware( {
    target: target,
    logLevel: 'silent',
    changeOrigin: true,
    xfwd: true,
    pathRewrite: pathRewrite,
    onProxyReq: function onProxyReq(proxyReq, req, res) {
      //logger.debug('proxy frontend: adding header auth ' + res.locals.on_behalf_of_authorization)
      proxyReq.setHeader(
        "Authorization",
        res.locals.on_behalf_of_authorization
      )
    }
  })
}

const socketProxy = createProxyMiddleware({
  target: process.env.VITE_EESSI_PENSJON_WEBSOCKETURL + ':8080-*****/bucUpdate',
  ws: true
})

console.log("process.env.VITE_EESSI_PENSJON_WEBSOCKETURL: " + process.env.VITE_EESSI_PENSJON_WEBSOCKETURL)

const timedOut = function (req, res, next) {
  if (!req.timedout) {
    next()
  } else {
    //logger.warning('request for ' + req.originalUrl + ' timed out!')
    logger.warning('request for original url timed out!')
  }
}

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

console.log("__filename: " + __filename);
console.log("__dirname: " + __dirname);

app.get('/test', (req, res) => res.send('hello world'));

app.get('/callback/*', handleCallback);

app.get('/internal/isAlive|isReady|metrics', (req, res) => res.sendStatus(200));

app.use('/assets', express.static(path.join(__dirname, "build", "assets")));

app.use('/static', express.static(path.join(__dirname, "build", "static")));

app.use('/locales', express.static(path.join(__dirname, "build", "locales")));

app.use('/favicon', express.static(path.join(__dirname, "build", "favicon")));

app.get(["/oauth2/login"], async (req, res) => {
  console.log("Inside app.get oauth2")
  logger.error("Wonderwall must handle /oauth2/login")
  res.status(502).send({
    message: "Wonderwall must handle /oauth2/login",
  });
});

app.use('/frontend',
  timedOut,
  apiAuth(process.env.VITE_EESSI_PENSJON_FRONTEND_API_TOKEN_SCOPE),
  apiProxy(process.env.VITE_EESSI_PENSJON_FRONTEND_API_URL,{ '^/frontend/' : '/' })
)

console.log("process.env.VITE_EESSI_PENSJON_FRONTEND_API_TOKEN_SCOPE: " + process.env.VITE_EESSI_PENSJON_FRONTEND_API_TOKEN_SCOPE)
console.log("process.env.VITE_EESSI_PENSJON_FRONTEND_API_URL: " + process.env.VITE_EESSI_PENSJON_FRONTEND_API_URL)

app.use('/fagmodul',
  timedOut,
  apiAuth(process.env.VITE_EESSI_PENSJON_FAGMODUL_TOKEN_SCOPE),
  apiProxy(process.env.VITE_EESSI_PENSJON_FAGMODUL_URL,{ '^/fagmodul/' : '/' })
)

app.use('/websocket', socketProxy)

app.use('*', mainPageAuth, express.static(path.join(__dirname, "build")));

console.log("Before app.listen at the end of the file")

// start express server on port 8080
app.listen(8080, () => {
  logger.info("eessi-pensjon-saksbehandling-ui started on port 8080");
  console.log("eessi-pensjon-saksbehandling-ui started on port 8080")
});

console.log("The end of the file")
