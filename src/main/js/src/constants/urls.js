var BASE_URL = window.location.protocol.concat('//').concat(window.location.hostname);
if (window.location.port) {
    BASE_URL = BASE_URL.concat(':' + window.location.port);
}

export const CASE_URL        = BASE_URL + '/api/case';
export const INSTITUTION_URL = BASE_URL + '/api/institutions';
export const BUC_URL         = BASE_URL + '/api/bucs';
export const SED_URL         = BASE_URL + '/api/seds';
export const CASESUBMIT_URL  = BASE_URL + '/fag/case';
