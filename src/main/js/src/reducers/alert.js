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
            serverErrorMessage : 'serverOffline'
        });

    case types.USERCASE_GET_CASE_NUMBER_REQUEST:
    case types.USERCASE_GET_SUBJECT_AREA_LIST_REQUEST:
    case types.USERCASE_GET_INSTITUTION_LIST_REQUEST:
    case types.USERCASE_GET_SED_LIST_REQUEST:
    case types.USERCASE_GET_BUC_LIST_REQUEST:
    case types.USERCASE_GET_COUNTRY_LIST_REQUEST:
    case types.USERCASE_SEND_DATA_REQUEST:
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
            clientErrorMessage : 'case:error-noSubjectAreaList'
        });

    case types.USERCASE_GET_INSTITUTION_LIST_FAILURE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'ERROR',
            clientErrorMessage : 'case:error-noInstitutionList'
        });

    case types.USERCASE_GET_SED_LIST_FAILURE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'ERROR',
            clientErrorMessage : 'case:error-noSedList'
        });

    case types.USERCASE_GET_BUC_LIST_FAILURE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'ERROR',
            clientErrorMessage : 'case:error-noBucList'
        });

    case types.USERCASE_GET_COUNTRY_LIST_FAILURE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'ERROR',
            clientErrorMessage : 'case:error-noCountryList'
        });

    case types.USERCASE_GET_CASE_NUMBER_FAILURE:
    case types.USERCASE_GENERATE_DATA_FAILURE:
    case types.USERCASE_SEND_DATA_FAILURE:
    case types.RINA_GET_URL_FAILURE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'ERROR',
            clientErrorMessage : processError(action.payload)
        });

    case types.USER_INFO_FAILURE: {

        return Object.assign({}, state, {
            serverErrorMessage : 'case:error-noSuchUser'
        });
    }

    case types.PDF_GENERATE_FAILURE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'ERROR',
            clientErrorMessage : 'pdf:error-PdfGenerationFail'
        });

    case types.P4000_NEW:

        return Object.assign({}, state, {
            clientErrorStatus  : 'OK',
            clientErrorMessage : 'p4000:newP4000Form'
        });

    case types.P4000_OPEN_SUCCESS:

        return Object.assign({}, state, {
            clientErrorStatus  : 'OK',
            clientErrorMessage : 'p4000:openP4000Form'
        });

    case types.P4000_OPEN_FAILURE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'ERROR',
            clientErrorMessage : 'p4000:error-openP4000|' + action.payload.error
        });

    case types.P4000_EVENT_ADD:

        return Object.assign({}, state, {
            clientErrorStatus  : 'OK',
            clientErrorMessage : 'p4000:addedP4000Event'
        });

    case types.P4000_EVENT_REPLACE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'OK',
            clientErrorMessage : 'p4000:replacedP4000Event'
        });

    case types.P4000_EVENT_DELETE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'OK',
            clientErrorMessage : 'p4000:deletedP4000Event'
        });

    case types.P4000_SUBMIT_SUCCESS:

        return Object.assign({}, state, {
            clientErrorStatus  : 'OK',
            clientErrorMessage : 'p4000:file-submitSuccess'
        });

    case types.P4000_SUBMIT_FAILURE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'ERROR',
            clientErrorMessage : 'p4000:file-submitFailure'
        });


    default:

        return state;
    }
}
