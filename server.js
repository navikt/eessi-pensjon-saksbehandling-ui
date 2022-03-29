const express = require("express");
const path = require("path");
const app = express(); // create express app
const request = require('request');
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

app.use('/frontend/', function(req,res) {
  const {
    method,
    headers
  } = req;
  var newurl = 'http://eessi-pensjon-frontend-api-fss-q2.dev.intern.nav.no/' + req.path // req.path is all it comes after /frontend/

  req.pipe(
    request({
      method,
      headers,
      uri: newurl
    }).on('response', response => {
      // unmodified http.IncomingMessage object
      res.writeHead(response.statusCode, response.headers);
      response.pipe(res);
    }).on('error', function(err) {
      console.error(err)
    })
  );
});

app.use('/fagmodul', function(req,res) {
  //modify the url in any way you want
  var newurl = 'http://eessi-pensjon-fagmodul-q2.dev.intern.nav.no';
  request(newurl).pipe(res);
});

app.get('/', express.static(buildPath, {index: false}));

// start express server on port 8080
app.listen(8080, () => {
  console.log("server started on port 8080");
});
