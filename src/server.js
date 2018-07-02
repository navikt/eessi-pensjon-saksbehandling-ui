let express = require('express');
let path = require('path');
let fs = require('fs');
let bodyParser = require('body-parser');

let http = require('http');

let api = require('./server/api.' + process.env.NODE_ENV);
let certificates = require('./server/certificates');
let login = require('./server/login');
let prometheus = require('./server/prometheus');

/* Resources from Fasit that need to be available to the application must be declared in this appconfig-object.
 *
 * Fasit-resources are automatically available as environment-variables in the container, but these variables
 * are not available in the Angular-app. The solution is to populate this appconfig-object and inject it as a
 * provider in AppModule.
 */
let appconfig = {
  eessiFagmodulUrl   : process.env['EESSIFAGMODULSERVICE_URL']     || 'https://eessi-fagmodul-t8.nais.preprod.local/',
  truststorePassword : process.env['NAV_TRUSTSTORE_PASSWORD']      || '467792be15c4a8807681fd2d5c9c1748',
  keystoreAlias      : process.env['NAV_TRUSTSTORE_KEYSTOREALIAS'] || 'webproxy',
  truststorePath     : process.env['NAV_TRUSTSTORE_PATH']          || './certificates/sample.jts',
  srvPensjonUsername : process.env['SRVPENSJON_USERNAME']          || 'srvPensjon',
  srvPensjonUsername : process.env['SRVPENSJON_PASSWORD']          || 'Ash5SoxP',
};

if (!fs.existsSync('assets'))
  fs.mkdirSync('assets');
fs.writeFileSync('assets/appconfig.json', JSON.stringify(appconfig));

/* Set up express server to serve app and diagnostic routes */
let app = express();

app.set('port', 80);
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

// Catch requests to /internal/isalive and /internal/isready that have 'Accept: application/json'.
// All other requests go to '*' and the React app.
app.get('/internal/:diagnostic', prometheus.handleDiagnostic);
app.get('/internal/metrics',  prometheus.handleMetrics);

app.get( '/api/case/:caseId', api.handleCase);
app.post('/api/casesubmit',   api.handleCaseSubmit);
app.get( '/api/institutions', api.handleInstitutions);
app.get( '/api/bucs',         api.handleBucs);
app.get( '/api/seds/:buc',    api.handleSeds);
app.get( '*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

let tokenId;

let main = async function () {

  if (process.env.NODE_ENV == 'production') {

     console.log('Production env: #1: Processing certificates')
     //await certificates.load(appconfig);
     console.log('Production env: #2: Logging in')
     //tokenId = await login.login(appconfig);
     console.log(tokenId)
  }


  console.log('ready for server');
  http.createServer(app).listen(app.get('port'), function () {
     console.log(('App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
  });
}

main();
