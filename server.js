const express = require("express");
const path = require("path");
const app = express(); // create express app

app.disable("x-powered-by");

const buildPath = path.resolve(__dirname, "build");

const basePath = "/";

/*app.get(basePath, (req, res) => {
  res.render('index.html');
});
*/
app.get('/test', (req, res) => {
  res.send('hello world')
});

app.get('/internal/isAlive|isReady', (req, res) => res.sendStatus(200));

app.get('/frontend', function(req,res) {
  //modify the url in any way you want
  var newurl = 'http://eessi-pensjon-frontend-api-fss-q2.dev.intern.nav.no';
  request(newurl).pipe(res);
});

app.get('/fagmodul', function(req,res) {
  //modify the url in any way you want
  var newurl = 'http://eessi-pensjon-fagmodul-q2.dev.intern.nav.no';
  request(newurl).pipe(res);
});

app.use('/', express.static(buildPath, {index: false}));

// start express server on port 8080
app.listen(8080, () => {
  console.log("server started on port 8080");
});
