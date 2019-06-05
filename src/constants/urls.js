const HOST = window.location.protocol + '//' + window.location.hostname
export const BASE_URL = HOST + (window.location.port ? ':' + window.location.port : '')

const FRONTEND_API_URL = BASE_URL + '/frontend'
const FAGMODUL_API_URL = BASE_URL + '/fagmodul'

const API_URL = FRONTEND_API_URL + '/api'
const SED_URL = FAGMODUL_API_URL + '/sed'
const BUC_URL = FRONTEND_API_URL + '/buc'
const EUX_URL = FRONTEND_API_URL + '/eux'
const PDF_URL = FRONTEND_API_URL + '/pdf'
const PEN_URL = FRONTEND_API_URL + '/pensjon'

export const NAV_URL = 'http://www.nav.no'

// EuxController
export const EUX_CASE_WITH_RINAID_URL = EUX_URL + '/case/%(sakId)s/%(aktoerId)s/%(rinaId)s'
export const EUX_CASE_WITHOUT_RINAID_URL = EUX_URL + '/case/%(sakId)s/%(aktoerId)s'
export const EUX_SUBJECT_AREA_URL = EUX_URL + '/subjectarea'
export const EUX_BUCS_URL = EUX_URL + '/bucs'

export const EUX_SED_FOR_BUCS_URL = EUX_URL + '/seds/%(buc)s'
export const EUX_SED_FROM_RINA_URL = EUX_URL + '/sedfromrina/%(rinaId)s'
export const EUX_CASE_FOR_RINAID_URL = EUX_URL + '/rinasaker/%(rinaId)s'
export const EUX_INSTITUTIONS_FOR_COUNTRY_URL = EUX_URL + '/institutions/%(country)s'
export const EUX_INSTITUTIONS_FOR_BUC_AND_COUNTRY_URL = EUX_URL + '/institutions/%(buc)s/%(country)s'
export const EUX_COUNTRY_URL = EUX_URL + '/countrycode'
export const EUX_RINA_URL = EUX_URL + '/rinaurl'

// UserInfoController
export const API_USERINFO_URL = API_URL + '/userinfo'
export const API_PERSONDATA_URL = API_URL + '/persondata'

// SubmitController
export const API_SUBMISSION_SUBMIT_URL = API_URL + '/submission/submit'
export const API_SUBMISSION_RECEIPT_URL = API_URL + '/submission/receipt'
export const API_SUBMISSION_RESUBMIT_URL = API_URL + '/submission/resubmit'

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

// SedController
export const BUC_AKTOERID_DETALJER_URL = SED_URL + '/bucdetaljer/%(aktoerId)s/'
export const BUC_CREATE_BUC_URL = SED_URL + '/buc/%(buc)s'

export const SED_PREVIEW_URL = SED_URL + '/preview'
export const SED_ADD_URL = SED_URL + '/add'
export const SED_SEND_URL = SED_URL + '/send/%(caseId)s/%(documentId)s/'

// PdfController
export const PDF_GENERATE_URL = PDF_URL + '/generate'

// Login
export const LOGIN_URL = FRONTEND_API_URL + '/login'
export const LOGOUT_URL = 'https://loginservice-q.nav.no/slo'
