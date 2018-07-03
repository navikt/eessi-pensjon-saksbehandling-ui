'use strict';

let url = require('url');
let request = require('./request');

let appconfig = {
  eessiFagmodulUrl: process.env['EESSIFAGMODULSERVICE_URL'] || 'https://eessi-fagmodul-t8.nais.preprod.local/'
};

let handleCase = function (req, res) {
  let caseId = req.params.caseId;
  if (caseId.match(/\d+/)) {
    res.json({caseId: caseId})
  } else {
    res.status(403).json({'serverMessage': 'invalidCaseNumber'});
  }
}

let handleCaseSubmit = async function (req, res) {

  let body = JSON.stringify(req.body);
  let srvUrl = url.parse(appconfig.eessiFagmodulUrl);

  try {
    let r = await request.https({
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
    res.json(r.body);
  } catch (err) {
    res.status(500).json({'serverMessage': err.statusCode});
  }
}

let handleInstitutions = async function (req, res) {

  let srvUrl = url.parse(appconfig.eessiFagmodulUrl);
  try {
    let r = await request.https({
      hostname           : srvUrl.host,
      path               : '/api/institutions',
      method             : 'GET',
      rejectUnauthorized : false,
      rejectCert         : true,
      agent              : false
    });
    res.json(r.body);
  } catch (err) {
    console.log(err)
    res.status(500).json({'serverMessage': err.statusCode});
  }
}

let handleBucs = async function (req, res) {

  let srvUrl = url.parse(appconfig.eessiFagmodulUrl) ;
  try {
    let r = await request.https({
      hostname           : srvUrl.host,
      path               : '/api/bucs',
      method             : 'GET',
      rejectUnauthorized : false,
      rejectCert         : true,
      agent              : false
    });
    res.json(r.body);
  } catch (err) {
    res.status(500).json({'serverMessage': err.statusCode});
  }
}

let handleSeds = async function (req, res) {

  let buc = req.params.buc;
  let srvUrl = url.parse(appconfig.eessiFagmodulUrl);

  try {
    let r = await request.https({
      hostname           : srvUrl.host,
      path               : '/api/seds/' + buc,
      method             : 'GET',
      rejectUnauthorized : false,
      rejectCert         : true,
      agent              : false
    });
    res.json(r.body);
  } catch (err) {
    res.status(500).json({'serverMessage': err.statusCode});
  }
}

module.exports = {
  handleCase,
  handleCaseSubmit,
  handleInstitutions,
  handleBucs,
  handleSeds
}
