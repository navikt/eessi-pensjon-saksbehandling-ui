var BASE_URL = window.location.protocol.concat('//').concat(window.location.hostname);
if (window.location.port) {
    BASE_URL = BASE_URL.concat(':' + window.location.port);
}

export const CASE_URL              = BASE_URL + '/api/case';
export const SUBJECT_AREA_LIST_URL = BASE_URL + '/api/subjectarea';
export const INSTITUTION_LIST_URL  = BASE_URL + '/api/institutions';
export const BUC_LIST_URL          = BASE_URL + '/api/bucs';
export const SED_LIST_URL          = BASE_URL + '/api/seds';
export const COUNTRY_LIST_URL      = BASE_URL + '/api/countrycode';

export const RINA_URL              = BASE_URL + '/api/rinaurl';

export const FAG_CREATE_URL        = BASE_URL + '/fag/create';
export const GENERATE_URL          = BASE_URL + '/fag/confirm';
