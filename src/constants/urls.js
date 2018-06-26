var protocol = window.location.protocol;
var host = protocol.concat('//').concat(window.location.hostname);

const BASE_URL = {
  'development': 'http://localhost:3000',
  'production': host + ':80'
};

export const CASE_URL       = BASE_URL[process.env.NODE_ENV] + '/api/case';
export const MOTTAGER_URL   = BASE_URL[process.env.NODE_ENV] + '/api/mottager';
export const BUC_URL        = BASE_URL[process.env.NODE_ENV] + '/api/buc';
export const SED_URL        = BASE_URL[process.env.NODE_ENV] + '/api/sed';
export const CASESUBMIT_URL = BASE_URL[process.env.NODE_ENV] + '/api/casesubmit';
