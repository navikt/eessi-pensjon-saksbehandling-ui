const express = require('express')
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')
const winston = require("winston");

const app = express();
app.disable("x-powered-by");

const options = {
  console: {
    level: "debug",
    handleExceptions: true,
    colorize: false,
  },
};

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

app.use('/frontend', createProxyMiddleware( {
  target: process.env.EESSI_PENSJON_FRONTEND_API_FSS_URL,
  logLevel: 'debug',
  changeOrigin: true,
  xfwd: true,
  pathRewrite:  { '^/frontend' : '/' },
  onProxyReq: function onProxyReq(proxyReq, req, res) {
    logger.debug('Request to frontend')
    logger.debug(req.headers)
    logger.debug(req.session)
    //logger.info('proxy frontend: adding header auth ' + res.locals.on_behalf_of_authorization)
    /*proxyReq.setHeader(
      "Authorization",
      res.locals.on_behalf_of_authorization
    )*/
  }
}))

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
    //logger.info('proxy fagmodul: adding header auth ' + res.locals.on_behalf_of_authorization)
    /*proxyReq.setHeader(
      "Authorization",
      res.locals.on_behalf_of_authorization
    )*/
  }
}))


app.use('*', express.static(path.join(__dirname, "build")));

// start express server on port 8080
app.listen(8080, () => {
  logger.info("eessi-pensjon-saksbehandling-ui started on port 8080");
});
