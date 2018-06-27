'use strict';

let http = require('http');
let https = require('https');
let url = require('url');

let appconfig = {
  eessiFagmodulUrl: process.env['EESSIFAGMODULSERVICE_URL'] || 'https://eessi-fagmodul-t8.nais.preprod.local/'
};


let doRequest = function (options) {

  console.log('Start doRequest')
  return new Promise((resolve, reject) => {
    console.log('on Promise')
    console.log(options)
    let req = https.request(options, (res) => {
      let body = '';
      console.log("On RES")
      res.on('data', (chunk) => {
         console.log("On RES DATA")
         body += chunk.toString()
      });
      res.on('error', err => {
         console.log("on RES ERROR")
         reject(err);
      });
      res.on('end', () => {
        console.log('on RES END, status Code: ' + res.statusCode);
        if (res.statusCode <= 200 && res.statusCode <= 299) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        } else {
          console.log(res)
          reject(res)
        }
      });
    });
    req.on('error', reject);
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

let handleCaseSubmit = function (req, res) {
  let params = req.body;
  if (params.institution && params.buc && params.sed) {
    res.json(params);
  } else {
    res.status(403).json({'serverMessage': 'insufficientParameters'});
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
      res.status(500).json({'serverMessage': err.syscall + ':' + err.code});
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
      res.status(500).json({'serverMessage': err.syscall + ':' + err.code});
    }
  }

  if (process.env.NODE_ENV == 'development') {
    res.json([
     'buc4',
     'buc5',
     'buc6'
   ])
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
      res.status(500).json({'serverMessage': err.syscall + ':' + err.code});
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
