import * as types from '../constants/actionTypes';

export default function (state = {}, action = {}) {

    switch (action.type) {

    case types.SERVER_OFFLINE:

        return Object.assign({}, state, {
            serverErrorMessage : 'serverOffline'
        });

    case types.USERCASE_GET_CASE_REQUEST:
    case types.USERCASE_GET_SUBJECT_AREA_LIST_REQUEST:
    case types.USERCASE_GET_INSTITUTION_LIST_REQUEST:
    case types.USERCASE_GET_SED_LIST_REQUEST:
    case types.USERCASE_GET_BUC_LIST_REQUEST:
    case types.USERCASE_GET_COUNTRY_LIST_REQUEST:
    case types.USERCASE_POST_REQUEST:

        return Object.assign({}, state, {
            clientErrorMessage : undefined,
            clientErrorStatus  : undefined
        });

    case types.USERCASE_GET_CASE_FAILURE:

         return Object.assign({}, state, {
               clientErrorStatus  : 'ERROR',
               clientErrorMessage : action.payload.serverMessage
         });

    case types.USERCASE_GET_SUBJECT_AREA_LIST_FAILURE:

         return Object.assign({}, state, {
               clientErrorStatus  : 'ERROR',
               clientErrorMessage : 'noSubjectAreaList'
         });

    case types.USERCASE_GET_INSTITUTION_LIST_FAILURE:

         return Object.assign({}, state, {
               clientErrorStatus  : 'ERROR',
               clientErrorMessage : 'noInstitutionList'
         });

    case types.USERCASE_GET_SED_LIST_FAILURE:

         return Object.assign({}, state, {
               clientErrorStatus  : 'ERROR',
               clientErrorMessage : 'noSedList'
         });

    case types.USERCASE_GET_BUC_LIST_FAILURE:

         return Object.assign({}, state, {
               clientErrorStatus  : 'ERROR',
               clientErrorMessage : 'noBucList'
         });

    case types.USERCASE_GET_COUNTRY_LIST_FAILURE:

         return Object.assign({}, state, {
               clientErrorStatus  : 'ERROR',
               clientErrorMessage : 'noCountryList'
         });

    case types.USERCASE_POST_FAILURE:

        return Object.assign({}, state, {
            clientErrorStatus  : 'ERROR',
            clientErrorMessage : action.payload.serverMessage
        });

    default:

        return state;
    }
}
