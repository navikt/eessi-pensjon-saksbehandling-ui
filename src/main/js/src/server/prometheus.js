
let prometheus = require('prom-client');

/* Prometheus default metrics */
prometheus.collectDefaultMetrics();

let handleMetrics = function (req, res) {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(prometheus.register.metrics());
}

let handleDiagnostic = function (req, res, next) {

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
}

module.exports = {
  handleMetrics,
  handleDiagnostic
}
