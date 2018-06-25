let express = require('express');
let path = require('path');
let fs = require('fs');
let prometheus = require('prom-client');
let http = require('http');

/* Resources from Fasit that need to be available to the application must be declared in this appconfig-object.
 *
 * Fasit-resources are automatically available as environment-variables in the container, but these variables
 * are not available in the Angular-app. The solution is to populate this appconfig-object and inject it as a
 * provider in AppModule.
 */
let appconfig = {
  eessiFagmodulUrl: process.env['EESSIFAGMODULSERVICE_URL'] || 'https://eessi-fagmodul-t1.nais.preprod.local/'
};
if (!fs.existsSync('assets'))
  fs.mkdirSync('assets');
fs.writeFileSync('assets/appconfig.json', JSON.stringify(appconfig));

/* Prometheus default metrics */
prometheus.collectDefaultMetrics();

/* Set up express server to serve app and diagnostic routes */
let app = express();

app.set('port', 80);
app.use(express.static(path.join(__dirname, 'build')));

// Catch requests to /internal/isalive and /internal/isready that have 'Accept: application/json'.
// All other requests go to '*' and the Angular app.
app.get('/internal/:diagnostic', (req, res, next) => {

  if (req.header('Accepts') !== 'application/json') {
    next();
    return;
  }
  switch (req.params['diagnostic'].toLowerCase()) {
    case 'isalive':
      res.status(200).send('I\'m alive');
      break;
    case 'isready':
      res.status(200).send('I\'m ready');
      break;
    case 'selftest':
      res.status(200).send('I\'m ok');
      break;
    default:
      next();
  }
});

app.get('/internal/metrics', (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(prometheus.register.metrics());
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = http.createServer(app);
server.listen(app.get('port'), function () {
  console.log(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
});
