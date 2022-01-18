export const HOST = window.location.hostname
const FULL_HOST = window.location.protocol + '//' + HOST
export const BASE_URL = FULL_HOST + (window.location.port ? ':' + window.location.port : '')

const FRONTEND_API_URL = BASE_URL + '/frontend'
const FAGMODUL_API_URL = BASE_URL + '/fagmodul'

const API_URL = FRONTEND_API_URL + '/api'
const SED_URL = FAGMODUL_API_URL + '/sed'
const BUC_URL = FAGMODUL_API_URL + '/buc'
const EUX_URL = FAGMODUL_API_URL + '/eux'
const PEN_URL = FAGMODUL_API_URL + '/pensjon'
const PER_URL = FAGMODUL_API_URL + '/person'
const SAF_URL = FAGMODUL_API_URL + '/saf'
const JOU_URL = FAGMODUL_API_URL + '/journalforing'

// EuxController
export const EUX_SUBJECT_AREA_URL = EUX_URL + '/subjectarea'
export const EUX_COUNTRIES_FOR_BUC_URL = EUX_URL + '/countries/%(bucType)s'
export const EUX_RINA_URL = EUX_URL + '/rinaurl'
export const EUX_INSTITUTIONS_FOR_BUC_AND_COUNTRY_URL = EUX_URL + '/institutions/%(buc)s/%(country)s'

// UserInfoController
export const API_USERINFO_URL = API_URL + '/userinfo'

// StorageController
export const API_STORAGE_LIST_URL = API_URL + '/storage/list/%(userId)s___%(namespace)s'
export const API_STORAGE_GET_URL = API_URL + '/storage/get/%(userId)s___%(namespace)s___%(file)s'
export const API_STORAGE_POST_URL = API_URL + '/storage/%(userId)s___%(namespace)s___%(file)s'
export const API_STORAGE_DELETE_URL = API_URL + '/storage/%(userId)s___%(namespace)s___%(file)s'
export const API_STORAGE_MULTIPLE_DELETE_URL = API_URL + '/storage/multiple/%(userId)s___%(namespace)s'

// SafController
export const API_JOARK_LIST_URL = SAF_URL + '/metadata/%(userId)s'
export const API_JOARK_GET_URL = SAF_URL + '/hentdokument/%(journalpostId)s/%(dokumentInfoId)s/%(variantformat)s'
export const API_JOARK_ATTACHMENT_URL = SAF_URL + '/vedlegg/%(aktoerId)s/%(rinaId)s/%(rinaDokumentId)s/%(journalpostId)s/%(dokumentInfoId)s/%(variantformat)s'

// PersonController
export const PERSON_PDL_URL = PER_URL + '/pdl/%(aktoerId)s'
export const PERSON_PDL_AVDOD_URL = PER_URL + '/pdl/%(aktoerId)s/avdode/vedtak/%(vedtakId)s'
export const PERSON_GET_UFT_URL = PER_URL + '/vedtak/%(vedtakId)s/uforetidspunkt'

// BucController
export const BUC_GET_BUCSLIST_URL = BUC_URL + '/rinasaker/%(aktoerId)s/saknr/%(sakId)s'
export const BUC_GET_BUCSLIST_WITH_VEDTAKID_URL = BUC_URL + '/rinasaker/%(aktoerId)s/saknr/%(sakId)s/vedtak/%(vedtakId)s'
export const BUC_GET_BUCSLIST_WITH_AVDODFNR_URL = BUC_URL + '/rinasaker/%(aktoerId)s/saknr/%(sakId)s/avdod/%(avdodFnr)s'
export const BUC_GET_BUC_URL = BUC_URL + '/enkeldetalj/%(rinaCaseId)s/aktoerid/%(aktoerId)s/saknr/%(sakId)s/kilde/%(kilde)s'
export const BUC_GET_BUC_WITH_AVDOD_URL = BUC_URL + '/enkeldetalj/%(rinaCaseId)s/aktoerid/%(aktoerId)s/saknr/%(sakId)s/avdodfnr/%(avdodFnr)s/kilde/%(kilde)s'

export const BUC_GET_PARTICIPANTS_URL = BUC_URL + '/%(rinaCaseId)s/bucdeltakere'
export const BUC_GET_BUC_OPTIONS_URL = BUC_URL + '/bucs/%(sakId)s'
export const BUC_CREATE_BUC_URL = BUC_URL + '/%(buc)s'

// PensjonController
export const BUC_GET_KRAVDATO_URL = PEN_URL + '/kravdato/saker/%(sakId)s/krav/%(kravId)s/aktor/%(aktoerId)s'
export const BUC_GET_SAKTYPE_URL = PEN_URL + '/saktype/%(sakId)s/%(aktoerId)s'

// SedController
export const BUC_CREATE_SED_URL = SED_URL + '/add'
export const BUC_CREATE_REPLY_SED_URL = SED_URL + '/replysed/%(parentId)s'
export const BUC_GET_SED_LIST_URL = SED_URL + '/seds/%(buc)s/%(rinaId)s'
export const P5000_GET_URL = SED_URL + '/get/%(caseId)s/%(sedId)s'
export const P5000_PUT_URL = SED_URL + '/put/%(caseId)s/%(sedId)s'
export const BUC_GET_P6000_URL = SED_URL + '/getP6000/%(rinaCaseId)s'
export const BUC_GET_P6000PDF_URL = SED_URL + '/get/%(rinaCaseId)s/%(documentId)s/pdf'

// Journalføring
export const JOURNALFØRING_SED_GET_URL = JOU_URL + '/get/%(sakId)s/%(aktoerId)s'
export const JOURNALFØRING_SED_SEND_URL = JOU_URL + '/send/%(sakId)s/%(aktoerId)s/%(sedId)s'

// Login
export const LOGIN_URL = FRONTEND_API_URL + '/login'
export const LOGOUT_URL = 'https://loginservice-q.nav.no/slo'

// Page Notification
export const API_PAGENOTIFICATION_GET_URL = API_URL + '/storage/get/EP___PAGE___NOTIFICATION'
export const API_PAGENOTIFICATION_POST_URL = API_URL + '/storage/EP___PAGE___NOTIFICATION'

// Websocket
export const WEBSOCKET_LOCALHOST_URL = 'ws://localhost:8080/bucUpdate'


