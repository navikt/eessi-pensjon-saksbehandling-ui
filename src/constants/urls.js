export const BASE_URL = window.location.protocol + '//' +
                        window.location.hostname +
                        (window.location.port ? ':' + window.location.port : '');

let API_URL = BASE_URL + '/api';
let FAG_URL = BASE_URL + '/fag';
let PDF_URL = BASE_URL + '/pdf';

// EuxController
export const CASE_GET_RINA_URL                = API_URL + '/rinaurl';
export const CASE_GET_CASE_WITH_RINAID_URL    = API_URL + '/case/%(caseId)s/%(actorId)s/%(rinaId)s';
export const CASE_GET_CASE_WITHOUT_RINAID_URL = API_URL + '/case/%(caseId)s/%(actorId)s';
export const CASE_GET_BUC_LIST_URL            = API_URL + '/bucs';
export const CASE_GET_SED_LIST_URL            = API_URL + '/seds';
export const CASE_GET_SED_FOR_BUC_LIST_URL    = API_URL + '/seds/%(buc)s';
export const CASE_GET_SED_FROM_RINA_LIST_URL  = API_URL + '/sedfromrina/%(rinaId)s';
export const CASE_GET_BUC_FROM_RINA_LIST_URL  = API_URL + '/bucfromrina/%(rinaId)s';
export const STATUS_GET_URL                   = API_URL + '/aksjoner/%(rinaId)s';
export const STATUS_RINA_CASE_URL             = API_URL + '/rinasaker/%(rinaId)s';
export const CASE_GET_INSTITUTION_LIST_URL    = API_URL + '/institutions';
export const CASE_GET_INSTITUTION_FOR_COUNTRY_LIST_URL = API_URL + '/institutions/%(country)s';
export const CASE_GET_COUNTRY_LIST_URL       = API_URL + '/countrycode';
export const CASE_GET_SUBJECT_AREA_LIST_URL  = API_URL + '/subjectarea';
export const APP_GET_USERINFO_URL            = API_URL + '/userinfo';

// FagmodulController
export const CASE_CREATE_SED_URL    = FAG_URL + '/create';
export const CASE_GENERATE_DATA_URL = FAG_URL + '/confirm';
export const CASE_ADD_TO_SED_URL    = FAG_URL + '/addsed';
export const CASE_SEND_SED_URL      = FAG_URL + '/sendsed';
export const CASE_GET_SED_URL       = FAG_URL + '/sed/get/%(rinaId)s/%(dokumentId)s';
export const CASE_DELETE_SED_URL    = FAG_URL + '/sed/delete/%(rinaId)s/%(sed)s/%(dokumentId)s';

// Login
export const APP_LOGIN_URL = window.location.protocol + '//' + window.location.hostname + '/login';

// PdfController
export const PDF_GENERATE_URL = PDF_URL + '/generate';
export const PDF_GET_LIST_URL = PDF_URL + '/list';

