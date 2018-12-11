export const BASE_URL = window.location.protocol + '//' +
                        window.location.hostname +
                        (window.location.port ? ':' + window.location.port : '')

let API_URL = BASE_URL + '/api'
let FAG_URL = BASE_URL + '/fag'
let PDF_URL = BASE_URL + '/pdf'

// EuxController
export const CASE_GET_RINA_URL = API_URL + '/rinaurl'
export const CASE_GET_CASE_WITH_RINAID_URL = API_URL + '/case/%(sakId)s/%(aktoerId)s/%(rinaId)s'
export const CASE_GET_CASE_WITHOUT_RINAID_URL = API_URL + '/case/%(sakId)s/%(aktoerId)s'
export const CASE_GET_BUC_LIST_URL = API_URL + '/bucs'
export const CASE_GET_SED_LIST_URL = API_URL + '/seds'
export const CASE_GET_SED_FOR_BUC_LIST_URL = API_URL + '/seds/%(buc)s'
export const CASE_GET_SED_FROM_RINA_LIST_URL = API_URL + '/sedfromrina/%(rinaId)s'
export const CASE_GET_BUC_FROM_RINA_LIST_URL = API_URL + '/bucfromrina/%(rinaId)s'
export const STATUS_GET_URL = API_URL + '/aksjoner/%(rinaId)s'
export const STATUS_RINA_CASE_URL = API_URL + '/rinasaker/%(rinaId)s'
export const CASE_GET_INSTITUTION_LIST_URL = API_URL + '/institutions'
export const CASE_GET_INSTITUTION_FOR_COUNTRY_LIST_URL = API_URL + '/institutions/%(country)s'
export const CASE_GET_COUNTRY_LIST_URL = API_URL + '/countrycode'
export const CASE_GET_SUBJECT_AREA_LIST_URL = API_URL + '/subjectarea'
export const APP_GET_USERINFO_URL = API_URL + '/userinfo'
export const PINFO_SEND_URL = API_URL + '/submission/submit'

// StorageController
export const STORAGE_LIST_URL = API_URL + '/storage/list/%(userId)s___%(namespace)s'
export const STORAGE_GET_URL = API_URL + '/storage/get/%(userId)s___%(namespace)s___%(file)s'
export const STORAGE_POST_URL = API_URL + '/storage/%(userId)s___%(namespace)s___%(file)s'
export const STORAGE_DELETE_URL = API_URL + '/storage/%(userId)s___%(namespace)s___%(file)s'

// FagmodulController
export const CASE_CREATE_SED_URL = FAG_URL + '/buc/create'
export const CASE_GENERATE_DATA_URL = FAG_URL + '/sed/confirm'
export const CASE_ADD_TO_SED_URL = FAG_URL + '/sed/add'
export const CASE_SEND_SED_URL = FAG_URL + '/sed/send'
export const CASE_SED_URL = FAG_URL + '/sed/%(rinaId)s/%(dokumentId)s'

// Login
export const APP_LOGIN_URL = window.location.protocol + '//' + window.location.hostname + '/login'
export const APP_LOGOUT_URL = 'https://loginservice-q.nav.no/slo'

// PdfController
export const PDF_GENERATE_URL = PDF_URL + '/generate'
