'use strict';

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

let handleInstitutions = function (req, res) {

  res.json([
    'Mottager4',
    'Mottager5',
    'Mottager6'
  ]);
}

let handleBucs = function (req, res) {

  res.json([
    'buc4',
    'buc5',
    'buc6'
  ]);
}

let handleSeds = function (req, res) {

  let buc = req.params.buc;

  res.json([
    'sed4' + buc,
    'sed5' + buc,
    'sed6' + buc
  ]);
}

module.exports = {
  handleCase,
  handleCaseSubmit,
  handleInstitutions,
  handleBucs,
  handleSeds
}
