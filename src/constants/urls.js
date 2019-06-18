export const HOST = window.location.hostname
const FULL_HOST = window.location.protocol + '//' + HOST
export const BASE_URL = FULL_HOST + (window.location.port ? ':' + window.location.port : '')

const FRONTEND_API_URL = BASE_URL + '/frontend'
const FAGMODUL_API_URL = BASE_URL + '/fagmodul'

const API_URL = FRONTEND_API_URL + '/api'
const SED_URL = FAGMODUL_API_URL + '/sed'
const BUC_URL = FAGMODUL_API_URL + '/buc'
const EUX_URL = FRONTEND_API_URL + '/eux'
const PDF_URL = FRONTEND_API_URL + '/pdf'
const PER_URL = FAGMODUL_API_URL + '/person'
const SAF_URL = FAGMODUL_API_URL + '/saf'

export const NAV_URL = 'http://www.nav.no'

// EuxController
export const EUX_CASE_URL = EUX_URL + '/case/%(sakId)s/%(aktoerId)s'
export const EUX_SUBJECT_AREA_URL = EUX_URL + '/subjectarea'
export const EUX_BUCS_URL = EUX_URL + '/bucs'
export const EUX_COUNTRY_URL = EUX_URL + '/countrycode'
export const EUX_SED_FOR_BUCS_URL = EUX_URL + '/seds/%(buc)s'
export const EUX_INSTITUTIONS_FOR_BUC_AND_COUNTRY_URL = EUX_URL + '/institutions/%(buc)s/%(country)s'
export const EUX_RINA_URL = EUX_URL + '/rinaurl'

// UserInfoController
export const API_USERINFO_URL = API_URL + '/userinfo'

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

// JoarkController
export const API_JOARK_LIST_URL = SAF_URL + '/metadata/%(userId)s'
export const API_JOARK_GET_URL = SAF_URL + '/get/%(userId)s/%(file)s'

// PersonController
export const PERSON_URL = PER_URL + '/%(aktoerId)s'

// BucController
export const BUC_AKTOERID_DETALJER_URL = BUC_URL + '/detaljer/%(aktoerId)s/'
export const BUC_CREATE_BUC_URL = BUC_URL + '/%(buc)s'

// SedController
export const BUC_CREATE_SED_URL = SED_URL + '/add'

// PdfController
export const PDF_GENERATE_URL = PDF_URL + '/generate'

// Login
export const LOGIN_URL = FRONTEND_API_URL + '/login'
export const LOGOUT_URL = 'https://loginservice-q.nav.no/slo'
