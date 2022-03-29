const express = require("express");
const path = require("path");
const app = express(); // create express app

app.disable("x-powered-by");

const buildPath = path.resolve(__dirname, "build");

const basePath = "/";

app.use(basePath, express.static(buildPath, {index: false}));

app.get(`${basePath}/internal/isAlive|isReady`, (req, res) => res.sendStatus(200));

app.get('${basePath}/frontend', function(req,res) {
  //modify the url in any way you want
  var newurl = 'http://eessi-pensjon-frontend-api-fss-q2.dev.intern.nav.no';
  request(newurl).pipe(res);
});

app.get('${basePath}/fagmodul', function(req,res) {
  //modify the url in any way you want
  var newurl = 'http://eessi-pensjon-fagmodul-q2.dev.intern.nav.no';
  request(newurl).pipe(res);
});

// start express server on port 8080
app.listen(8080, () => {
  console.log("server started on port 8080");
});
