let HOST = window.location.protocol + '//' + window.location.hostname
export const BASE_URL = HOST + (window.location.port ? ':' + window.location.port : '')

let BACKEND_URL = window.location.hostname === 'localhost' ? BASE_URL : BASE_URL + '/backend'
let API_URL = BACKEND_URL + '/api'
let SED_URL = BACKEND_URL + '/sed'
let BUC_URL = BACKEND_URL + '/buc'
let EUX_URL = BACKEND_URL + '/eux'
let PDF_URL = BACKEND_URL + '/pdf'
let PEN_URL = BACKEND_URL + '/pensjon'

export const NAV_URL = 'http://www.nav.no'

// EuxController
export const EUX_RINA_URL = EUX_URL + '/rinaurl'
export const EUX_CASE_WITH_RINAID_URL = EUX_URL + '/case/%(sakId)s/%(aktoerId)s/%(rinaId)s'
export const EUX_CASE_WITHOUT_RINAID_URL = EUX_URL + '/case/%(sakId)s/%(aktoerId)s'
export const EUX_BUCS_URL = EUX_URL + '/bucs'
export const EUX_SED_FOR_BUCS_URL = EUX_URL + '/seds/%(buc)s'
export const EUX_SED_FROM_RINA_URL = EUX_URL + '/sedfromrina/%(rinaId)s'
export const EUX_CASE_FOR_RINAID_URL = EUX_URL + '/rinasaker/%(rinaId)s'
export const EUX_INSTITUTIONS_FOR_COUNTRY_URL = EUX_URL + '/institutions/%(country)s'
export const EUX_INSTITUTIONS_FOR_BUC_AND_COUNTRY_URL = EUX_URL + '/institutions/%(buc)s/%(country)s'
export const EUX_COUNTRY_URL = EUX_URL + '/countrycode'
export const EUX_SUBJECT_AREA_URL = EUX_URL + '/subjectarea'

// UserInfoController
export const API_USERINFO_URL = API_URL + '/userinfo'
export const API_PERSONDATA_URL = API_URL + '/persondata'

// SubmitController
export const API_SUBMISSION_SUBMIT_URL = API_URL + '/submission/submit'
export const API_SUBMISSION_RECEIPT_URL = API_URL + '/submission/receipt'

// VarselController
export const API_VARSEL_URL = API_URL + '/varsel?saksId=%(sakId)s&aktoerId=%(aktoerId)s'

// StorageController
export const API_STORAGE_LIST_URL = API_URL + '/storage/list/%(userId)s___%(namespace)s'
export const API_STORAGE_GET_URL = API_URL + '/storage/get/%(userId)s___%(namespace)s___%(file)s'
export const API_STORAGE_POST_URL = API_URL + '/storage/%(userId)s___%(namespace)s___%(file)s'
export const API_STORAGE_DELETE_URL = API_URL + '/storage/%(userId)s___%(namespace)s___%(file)s'
export const API_STORAGE_MULTIPLE_DELETE_URL = API_URL + '/storage/multiple/%(userId)s___%(namespace)s'

// PensjonController
export const PEN_SAKTYPE_URL = PEN_URL + '/saktype/%(sakId)s/%(aktoerId)s'

// BucController
export const BUC_WITH_RINAID_URL = BUC_URL + '/%(rinaId)s'
export const BUC_WITH_RINAID_NAME_URL = BUC_URL + '/%(rinaId)s/name'
export const BUC_ACTIONS_URL = BUC_URL + '/aksjoner'
export const BUC_ACTIONS_FOR_RINAID_URL = BUC_URL + '/%(rinaId)s/aksjoner'
export const BUC_ACTIONS_FOR_RINAID_AND_FILTER_URL = BUC_URL + '/%(rinaId)s/aksjoner/%(filter)s'
export const BUC_ALL_DOCUMENTS_URL = BUC_URL + '/%(rinaId)s/allDocuments'

// SedController
export const SED_BUC_CREATE_URL = SED_URL + '/buc/create'
export const SED_PREVIEW_URL = SED_URL + '/preview'
export const SED_ADD_URL = SED_URL + '/add'
export const SED_SEND_URL = SED_URL + '/send/%(caseId)s/%(documentId)s/'
export const SED_WITH_RINAID_AND_DOCUMENTID_URL = '/%(rinaId)s/%(documentId)s/'

// PdfController
export const PDF_GENERATE_URL = PDF_URL + '/generate'

// Login
export const LOGIN_URL = BACKEND_URL + '/login'
export const LOGOUT_URL = 'https://loginservice-q.nav.no/slo'
