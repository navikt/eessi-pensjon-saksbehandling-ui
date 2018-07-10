var BASE_URL = window.location.protocol.concat('//').concat(window.location.hostname);
if (window.location.port) {
    BASE_URL = BASE_URL.concat(':' + window.location.port);
}

export const GET_CASE_NUMBER_URL       = BASE_URL + '/api/case';
export const GET_SUBJECT_AREA_LIST_URL = BASE_URL + '/api/subjectarea';
export const GET_INSTITUTION_LIST_URL  = BASE_URL + '/api/institutions';
export const GET_BUC_LIST_URL          = BASE_URL + '/api/bucs';
export const GET_SED_LIST_URL          = BASE_URL + '/api/seds';
export const GET_COUNTRY_LIST_URL      = BASE_URL + '/api/countrycode';
export const GET_RINA_URL              = BASE_URL + '/api/rinaurl';

export const SEND_DATA_URL             = BASE_URL + '/fag/create';
export const GENERATE_DATA_URL         = BASE_URL + '/fag/confirm';
