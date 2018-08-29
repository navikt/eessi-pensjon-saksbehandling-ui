var BASE_URL = window.location.protocol.concat('//').concat(window.location.hostname);
if (window.location.port) {
    BASE_URL = BASE_URL.concat(':' + window.location.port);
}

export const UI_GET_USER_INFO_URL = BASE_URL + '/api/userinfo';

export const CASE_GET_CASE_NUMBER_URL        = BASE_URL + '/api/case';
export const CASE_GET_SUBJECT_AREA_LIST_URL  = BASE_URL + '/api/subjectarea';
export const CASE_GET_INSTITUTION_LIST_URL   = BASE_URL + '/api/institutions';
export const CASE_GET_BUC_LIST_URL           = BASE_URL + '/api/bucs';
export const CASE_GET_BUC_LIST_FROM_RINA_URL = BASE_URL + '/api/bucfromrina';
export const CASE_GET_SED_LIST_URL           = BASE_URL + '/api/seds';
export const CASE_GET_SED_LIST_FROM_RINA_URL = BASE_URL + '/api/sedfromrina';
export const CASE_GET_COUNTRY_LIST_URL       = BASE_URL + '/api/countrycode';
export const CASE_GET_RINA_URL               = BASE_URL + '/api/rinaurl';

export const STATUS_GET_URL  = BASE_URL + '/api/aksjoner';

export const CASE_CREATE_SED_URL    = BASE_URL + '/fag/create';
export const CASE_ADD_TO_SED_URL    = BASE_URL + '/fag/addsed';
export const CASE_SEND_SED_URL      = BASE_URL + '/fag/sendsed';
export const CASE_GENERATE_DATA_URL = BASE_URL + '/fag/confirm';

export const PDF_GENERATE_URL = BASE_URL + '/pdf/generate';

