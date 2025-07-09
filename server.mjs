import express from 'express'
import path from 'path'
import { createProxyMiddleware } from 'http-proxy-middleware'
import winston from 'winston'
import fetch from 'cross-fetch'
import { URLSearchParams } from 'url'
import timeout from 'connect-timeout';
import { getToken, validateToken } from '@navikt/oasis';

import { fileURLToPath } from 'url';

const app = express();
app.use(timeout('60s'));
app.disable("x-powered-by");

const azureAdConfig = {
  clientId: process.env.AZURE_APP_CLIENT_ID,
  clientSecret: process.env.AZURE_APP_CLIENT_SECRET,
  tokenEndpoint: process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT
};

const onBehalfOf = function(scope, assertion) {
  const params = new URLSearchParams();
  params.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  params.append("client_id", azureAdConfig.clientId);
  params.append("client_secret", azureAdConfig.clientSecret);
  params.append("scope", scope);
  params.append("assertion", assertion);
  params.append("requested_token_use", "on_behalf_of");
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

const validateAuthorization = async (token) => {
  const JWTVerifyResult = await validateToken(token);
  if (!JWTVerifyResult.ok) {
    logger.error('azure ad error', JWTVerifyResult.error);
    return false;
  }
  return true;
}

const mainPageAuth = async function(req, res, next) {
  const {sakId, aktoerId, fnr, vedtakId, kravId, saksNr, sakType, avdodFnr} = req.query
  const newPath =
    (aktoerId !== undefined && aktoerId !== '' ? aktoerId : '-') + '/' +
    (sakId !== undefined && sakId !== '' ? sakId : ( saksNr !== undefined &&  saksNr !== '' ? saksNr : '-')) + '/' +
    (kravId !== undefined && kravId !== '' ? kravId : '-') + '/' +
    (vedtakId !== undefined && vedtakId !== '' ? vedtakId :  '-') + '/' +
    (sakType !== undefined && sakType !== '' ? sakType :  '-') + '/' +
    (avdodFnr !== undefined && avdodFnr !== '' ? avdodFnr :  '-') + '/' +
    (fnr !== undefined && fnr !== '' ? fnr : '-') + '/'

  const gjenny = req.originalUrl.indexOf('gjenny') > 0 ? 'GJENNY': '-' + '/'

  const loginPath = '/oauth2/login?redirect=/callback/' + newPath + gjenny
  logger.debug('mainPageAuth: loginPath = ' + loginPath)
  const {authorization} = req.headers

  // Not logged in - log in with wonderwall
  if (!authorization) {
    logger.debug ('mainPageAuth: no auth, redirect to login ' + loginPath)
    res.redirect(loginPath)
  } else {
    // Validate token and continue to app
    const token = getToken(authorization);

    if(await validateAuthorization(token)) {
      next();
    } else {
      logger.debug('mainPageAuth: auth Invalid, 302 to login ' + loginPath)
      res.redirect(loginPath)
    }
  }
}

const handleCallback = (req, res) => {
  let paths = req.originalUrl.split('/')
  // /callback/123/456/789/012/Uføretrygd/ => ['', 'callback', '123', '456', '789', '012', 'Uføretrygd']
  let aktoerId = (paths[2] === '-' ? '' : paths[2])
  let sakId = (paths[3] === '-' ? '' : paths[3])
  let kravId = (paths[4] === '-' ? '' : paths[4])
  let vedtakId = (paths[5] === '-' ? '' : paths[5])
  let sakType = (paths[6] === '-' ? '' : paths[6])
  let avdodFnr = (paths[7] === '-' ? '' : paths[7])
  let fnr = (paths[8] === '-' ? '' : paths[8])

  let redirectPath = "/"
  if(aktoerId !== "" && sakId !== ""){
    redirectPath = '/?aktoerId=' +  aktoerId  + '&sakId=' + sakId
  }

  if(aktoerId !== "" && sakId !== "" && sakType !== ""){
    redirectPath = redirectPath + "&sakType=" + sakType
  }
  if(aktoerId !== "" && sakId !== "" && kravId !== ""){
    redirectPath = redirectPath + "&kravId=" + kravId
  }
  if(aktoerId !== "" && sakId !== "" && vedtakId !== ""){
    redirectPath = redirectPath + "&vedtakId=" + vedtakId
  }


  if(paths[9] === 'GJENNY'){
    if(fnr !== "" && sakId !== "" && sakType !== "" && avdodFnr !== ""){
      redirectPath = '/gjenny/?fnr=' +  fnr  + '&sakId=' + sakId + '&sakType=' + sakType + '&avdodFnr=' + avdodFnr
    } else {
      redirectPath = '/gjenny/'
    }
  }

  //logger.debug('handleCallback: redirecting to ' + redirectPath)
  logger.debug('handleCallback: redirecting to redirect path')
  res.redirect(redirectPath)
}

// require token
const apiAuth = function (scope) {
  return async function (req, res, next) {
    if (!req.headers.authorization) {
      logger.debug('redirecting to /oauth2/login')
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
          res.locals.on_behalf_of_authorization = "Bearer " + body.access_token;
          next();
        } else {
          logger.error(
            "Error fetching on behalf of token. Status code " + response.status
          );
          logger.error(body.error_description);
          logger.error(body);
          res.redirect("/oauth2/login");
        }
      } catch (error) {
        logger.error(error.message);
        res.redirect("/oauth2/login");
      }
    }
  }
}

const apiProxy = function (target, pathRewrite) {
  //logger.debug('On apiProxy, with target ' + target)
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

const timedOut = function (req, res, next) {
  if (!req.timedout) {
    next()
  } else {
    //logger.warning('request for ' + req.originalUrl + ' timed out!')
    logger.warning('request for original url timed out!')
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/test', (req, res) => res.send('hello world'));

app.get('/callback/{*splat}', handleCallback);

app.get('/internal/isAlive|isReady|metrics', (req, res) => res.sendStatus(200));

app.use('/assets', express.static(path.join(__dirname, "build", "assets")));

app.use('/static', express.static(path.join(__dirname, "build", "static")));

app.use('/locales', express.static(path.join(__dirname, "build", "locales")));

app.use('/favicon', express.static(path.join(__dirname, "build", "favicon")));

app.get(["/oauth2/login"], async (req, res) => {
  logger.info("Wonderwall must handle /oauth2/login 1")
  logger.info(res.statusCode)
  logger.info(res.statusText)
  logger.info(res.status)
  logger.info(req)
  logger.info(res)
  res.status(502).send({
    message: "Wonderwall must handle /oauth2/login 2",
  });
});

app.use('/frontend',
  timedOut,
  apiAuth(process.env.VITE_EESSI_PENSJON_FRONTEND_API_TOKEN_SCOPE),
  apiProxy(process.env.VITE_EESSI_PENSJON_FRONTEND_API_URL,{ '^/frontend/' : '/' })
)

app.use('/fagmodul',
  timedOut,
  apiAuth(process.env.VITE_EESSI_PENSJON_FAGMODUL_TOKEN_SCOPE),
  apiProxy(process.env.VITE_EESSI_PENSJON_FAGMODUL_URL,{ '^/fagmodul/' : '/' })
)

app.use('{*splat}', mainPageAuth, express.static(path.join(__dirname, "build")));

// start express server on port 8080
app.listen(8080, () => {
  logger.info("eessi-pensjon-saksbehandling-ui started on port 8080");
});
