var protocol = window.location.protocol;
var host = protocol.concat('//').concat(window.location.hostname);
if (window.location.port) {
   host = host.concat(':' + window.location.port);
}

const BASE_URL = host;

export const CASE_URL       = BASE_URL + '/api/case';
export const MOTTAGER_URL   = BASE_URL + '/api/mottager';
export const BUC_URL        = BASE_URL + '/api/buc';
export const SED_URL        = BASE_URL + '/api/sed';
export const CASESUBMIT_URL = BASE_URL + '/api/casesubmit';
