'use strict';

let https = require('https');
let url = require('url');

let appconfig = {
  eessiFagmodulUrl: process.env['EESSIFAGMODULSERVICE_URL'] || 'https://eessi-fagmodul-t8.nais.preprod.local/'
};


let doRequest = function (options) {

  return new Promise((resolve, reject) => {
    console.log('HTTPS request ' + options.method + ' ' + options.hostname + options.path)
    let req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => {
        body += chunk.toString();
      });
      res.on('error', err => {
        reject(err);
      });
      res.on('end', () => {
        console.log('HTTPS request ended, status Code: ' + res.statusCode);
        if (res.statusCode <= 200 && res.statusCode <= 299) {
          resolve({
            statusCode : res.statusCode,
            headers    : res.headers,
            body       : body
          });
        } else {
          reject({
            statusCode : res.statusCode,
            headers    : res.headers
          });
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

let handleCase = function (req, res) {
  let caseId = req.params.caseId;
  if (caseId.match(/\d+/)) {
    res.json({caseId: caseId})
  } else {
    res.status(403).json({'serverMessage': 'invalidCaseNumber'});
  }
}

let handleCaseSubmit = async function (req, res) {

  if (process.env.NODE_ENV == 'production') {

    let body = JSON.stringify(req.body);

    let srvUrl = url.parse(appconfig.eessiFagmodulUrl);
    try {
      let request = await doRequest({
        hostname           : srvUrl.host,
        path               : '/api/create',
        method             : 'POST',
        headers            : {
          'Content-Type'   : 'application/json',
          'Content-Length' : body.length
        },
        body               : body,
        rejectUnauthorized : false,
        rejectCert         : true,
        agent              : false
      });
      res.json(request.body);
    } catch (err) {
      res.status(500).json({'serverMessage': err.statusCode});
    }
  }

  if (process.env.NODE_ENV == 'development') {
    if (params.institution && params.buc && params.sed) {
      res.json(params);
    } else {
      res.status(403).json({'serverMessage': 'insufficientParameters'});
    }
  }
}

let handleInstitutions = async function (req, res) {

  if (process.env.NODE_ENV == 'production') {

    let srvUrl = url.parse(appconfig.eessiFagmodulUrl);
    try {
      let request = await doRequest({
        hostname           : srvUrl.host,
        path               : '/api/institutions',
        method             : 'GET',
        rejectUnauthorized : false,
        rejectCert         : true,
        agent              : false
      });
      res.json(request.body);
    } catch (err) {
      res.status(500).json({'serverMessage': err.statusCode});
    }
  }

  if (process.env.NODE_ENV == 'development') {
    res.json([
      'Mottager4',
      'Mottager5',
      'Mottager6'
    ])
  }
}

let handleBucs = async function (req, res) {

  if (process.env.NODE_ENV == 'production') {

    let srvUrl = url.parse(appconfig.eessiFagmodulUrl) ;
    try {
      let request = await doRequest({
        hostname           : srvUrl.host,
        path               : '/api/bucs',
        method             : 'GET',
        rejectUnauthorized : false,
        rejectCert         : true,
        agent              : false
      });
      res.json(request.body);
    } catch (err) {
      res.status(500).json({'serverMessage': err.statusCode});
    }
  }

  if (process.env.NODE_ENV == 'development') {
    res.json([
      'buc4',
      'buc5',
      'buc6'
    ]);
  }
}

let handleSeds = async function (req, res) {

  let buc = req.params.buc;

  if (process.env.NODE_ENV == 'production') {

    let srvUrl = url.parse(appconfig.eessiFagmodulUrl) ;
    try {
      let request = await doRequest({
        hostname           : srvUrl.host,
        path               : '/api/seds',
        method             : 'GET',
        rejectUnauthorized : false,
        rejectCert         : true,
        agent              : false
      });
      res.json(request.body);
    } catch (err) {
       res.status(500).json({'serverMessage': err.statusCode});
    }
  }

  if (process.env.NODE_ENV == 'development') {
    res.json([
      'sed4' + buc,
      'sed5' + buc,
      'sed6' + buc
    ]);
  }
}

module.exports = {
  handleCase,
  handleCaseSubmit,
  handleInstitutions,
  handleBucs,
  handleSeds
}
