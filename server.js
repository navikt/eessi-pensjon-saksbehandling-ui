const express = require('express')
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')
const winston = require("winston");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

const app = express();
app.disable("x-powered-by");

const options = {
  console: {
    level: "debug",
    handleExceptions: true,
    colorize: false,
  },
};

const azureAdConfig = {
  tpBackendScope: process.env.TP_BACKEND_SCOPE,
  clientId: process.env.AZURE_APP_CLIENT_ID,
  clientSecret: process.env.AZURE_APP_CLIENT_SECRET,
  tokenEndpoint: process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT,
};

const onBehalfOf = function(scope, assertion) {
  const params = new URLSearchParams();
  params.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  params.append("client_id", azureAdConfig.clientId);
  params.append("client_secret", azureAdConfig.clientSecret);
  params.append("scope", azureAdConfig.tpBackendScope);
  params.append("assertion", assertion);
  params.append("requested_token_use", "on_behalf_of");

  return fetch(azureAdConfig.tokenEndpoint, {
    body: params,
    method: "POST",
  });
}

const logger = winston.createLogger({
  transports: new winston.transports.Console(options.console),
  exitOnError: false,
});

app.get('/test', (req, res) => res.send('hello world'));
app.get('/internal/isAlive|isReady|metrics', (req, res) => res.sendStatus(200));

app.use('/static', express.static(path.join(__dirname, "build", "static")));
app.use('/locales', express.static(path.join(__dirname, "build", "locales")));
app.use('/favicon', express.static(path.join(__dirname, "build", "favicon")));

app.get(["/oauth2/login"], async (req, res) => {
  logger.error("Wonderwall must handle /oauth2/login")
  res.status(502).send({
    message: "Wonderwall must handle /oauth2/login",
  });
});

// require token
const frontendApiAuth = async function (req, res, next) {
  logger.info('On frontendApiAuth')
  if (!req.headers.authorization) {
    logger.info('redirecting to login')
    res.redirect("/oauth2/login");
  } else {
    try {
      logger.info('trying onbehalfof with ' + req.headers.authorization)
      const response = await onBehalfOf(
        req.headers.authorization.substring("Bearer ".length)
      );

      const body = await response.json();

      logger.info('got  ' + body.access_token)

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

const frontendApiProxy = createProxyMiddleware( {
  target: process.env.EESSI_PENSJON_FRONTEND_API_FSS_URL,
  logLevel: 'debug',
  changeOrigin: true,
  xfwd: true,
  pathRewrite:  { '^/frontend' : '/' },
  onProxyReq: function onProxyReq(proxyReq, req, res) {
    logger.debug('Request to frontend')
    logger.debug(req.headers)
    logger.debug(req.session)
    logger.info('proxy frontend: adding header auth ' + res.locals.on_behalf_of_authorization)
    proxyReq.setHeader(
      "Authorization",
      res.locals.on_behalf_of_authorization
    )
  }
})

app.use('/frontend', frontendApiAuth, frontendApiProxy)

app.use('/fagmodul', createProxyMiddleware( {
  target: process.env.EESSI_PENSJON_FAGMODUL_URL,
  logLevel: 'debug',
  changeOrigin: true,
  xfwd: true,
  pathRewrite:  { '^/fagmodul' : '/' },
  onProxyReq: function onProxyReq(proxyReq, req, res) {
    logger.debug('Request to fagmodul')
    logger.debug(req.headers)
    logger.debug(req.session)
    logger.info('proxy fagmodul: adding header auth ' + res.locals.on_behalf_of_authorization)
    proxyReq.setHeader(
      "Authorization",
      res.locals.on_behalf_of_authorization
    )
  }
}))


app.use('*', express.static(path.join(__dirname, "build")));

// start express server on port 8080
app.listen(8080, () => {
  logger.info("eessi-pensjon-saksbehandling-ui started on port 8080");
});
