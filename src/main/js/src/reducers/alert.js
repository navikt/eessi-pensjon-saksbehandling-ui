import * as types from '../constants/actionTypes';

function processError(error) {
    let errorMessage = [];
    if (error.status) {
        errorMessage.push(error.status);
    }
    if (error.message) {
        errorMessage.push(error.message);
    } else {
        if (error.error) {
            errorMessage.push(error.error);
        }
    }
    if (error.serverMessage) {
        errorMessage.push(error.serverMessage);
    }
    return errorMessage.join(' ');
}

export default function (state = {}, action = {}) {

    switch (action.type) {

    case types.SERVER_OFFLINE:

        return Object.assign({}, state, {
            serverErrorMessage : 'ui:serverOffline'
        });

    case types.USERCASE_GET_CASE_NUMBER_REQUEST:
    case types.USERCASE_GET_SUBJECT_AREA_LIST_REQUEST:
    case types.USERCASE_GET_INSTITUTION_LIST_REQUEST:
    case types.USERCASE_GET_SED_LIST_REQUEST:
    case types.USERCASE_GET_BUC_LIST_REQUEST:
    case types.USERCASE_GET_COUNTRY_LIST_REQUEST:
    case types.USERCASE_CREATE_SED_REQUEST:
    case types.USERCASE_ADD_TO_SED_REQUEST:
    case types.USERCASE_GENERATE_DATA_REQUEST:
    case types.RINA_GET_URL_REQUEST:
    case types.ALERT_CLIENT_CLEAR:

        return Object.assign({}, state, {
            clientErrorMessage : undefined,
            clientErrorStatus  : undefined
        });

    case types.USERCASE_GET_SUBJECT_AREA_LIST_FAILURE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'ERROR',
            clientErrorMessage : 'case:alert-noSubjectAreaList'
        });

    case types.USERCASE_GET_INSTITUTION_LIST_FAILURE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'ERROR',
            clientErrorMessage : 'case:alert-noInstitutionList'
        });

    case types.USERCASE_GET_SED_LIST_FAILURE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'ERROR',
            clientErrorMessage : 'case:alert-noSedList'
        });

    case types.USERCASE_GET_BUC_LIST_FAILURE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'ERROR',
            clientErrorMessage : 'case:alert-noBucList'
        });

    case types.USERCASE_GET_COUNTRY_LIST_FAILURE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'ERROR',
            clientErrorMessage : 'case:alert-noCountryList'
        });

    case types.USERCASE_GET_CASE_NUMBER_FAILURE:
    case types.USERCASE_GENERATE_DATA_FAILURE:
    case types.USERCASE_CREATE_SED_FAILURE:
    case types.USERCASE_ADD_TO_SED_FAILURE:
    case types.RINA_GET_URL_FAILURE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'ERROR',
            clientErrorMessage : processError(action.payload)
        });

    case types.USERCASE_GET_CASE_NUMBER_SUCCESS:

        return Object.assign({}, state, {
            clientErrorStatus  : 'OK',
            clientErrorMessage : 'case:alert-caseFound'
        });

    case types.USERCASE_GENERATE_DATA_SUCCESS:

        return Object.assign({}, state, {
            clientErrorStatus  : 'OK',
            clientErrorMessage : 'case:alert-generatedData'
        });

    case types.USERCASE_CREATE_SED_SUCCESS:
    case types.USERCASE_ADD_TO_SED_SUCCESS:

        return Object.assign({}, state, {
            clientErrorStatus  : 'OK',
            clientErrorMessage : 'case:alert-sentData'
        });

    case types.USER_INFO_FAILURE: {

        return Object.assign({}, state, {
            serverErrorMessage : 'ui:alert-noSuchUser'
        });
    }

    case types.PDF_GENERATE_FAILURE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'ERROR',
            clientErrorMessage : 'pdf:alert-PDFGenerationFail'
        });

    case types.PDF_GENERATE_SUCCESS:

        return Object.assign({}, state, {
            clientErrorStatus  : 'OK',
            clientErrorMessage : 'pdf:alert-PDFGenerationSuccess'
        });

    case types.P4000_NEW:

        return Object.assign({}, state, {
            clientErrorStatus  : 'OK',
            clientErrorMessage : 'p4000:alert-newP4000Form'
        });

    case types.P4000_OPEN_SUCCESS:

        return Object.assign({}, state, {
            clientErrorStatus  : 'OK',
            clientErrorMessage : 'p4000:alert-openP4000Form'
        });

    case types.P4000_OPEN_FAILURE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'ERROR',
            clientErrorMessage : 'p4000:alert-openP4000error|' + action.payload.error
        });

    case types.P4000_EVENT_ADD:

        return Object.assign({}, state, {
            clientErrorStatus  : 'OK',
            clientErrorMessage : 'p4000:alert-addedP4000Event'
        });

    case types.P4000_EVENT_REPLACE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'OK',
            clientErrorMessage : 'p4000:alert-replacedP4000Event'
        });

    case types.P4000_EVENT_DELETE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'OK',
            clientErrorMessage : 'p4000:alert-deletedP4000Event'
        });

    case types.P4000_SUBMIT_SUCCESS:

        return Object.assign({}, state, {
            clientErrorStatus  : 'OK',
            clientErrorMessage : 'p4000:alert-submitSuccess'
        });

    case types.P4000_SUBMIT_FAILURE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'ERROR',
            clientErrorMessage : 'p4000:alert-submitFailure'
        });

    default:

        return state;
    }
}
