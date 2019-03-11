import * as types from '../constants/actionTypes'

let initialState = {
  step: 0
}

export default function (state = initialState, action = {}) {
  switch (action.type) {

    case types.CASE_STEP_SET:

      return Object.assign({}, state, {
        step: action.payload
      })

    case types.CASE_GET_SUBJECT_AREA_LIST_SUCCESS:

      return Object.assign({}, state, {
        subjectAreaList: action.payload
      })

    case types.CASE_GET_INSTITUTION_LIST_REQUEST:

      return Object.assign({}, state, {
        institutionList: undefined
      })

    case types.CASE_GET_SUBJECT_AREA_LIST_FAILURE:

      return Object.assign({}, state, {
        institutionList: []
      })

    case types.CASE_GET_INSTITUTION_LIST_SUCCESS:

      return Object.assign({}, state, {
        institutionList: action.payload
      })

    case types.CASE_GET_SED_LIST_SUCCESS:

      return Object.assign({}, state, {
        sedList: action.payload
      })

    case types.CASE_GET_BUC_LIST_REQUEST:

      return Object.assign({}, state, {
        bucList: []
      })

    case types.CASE_GET_BUC_LIST_SUCCESS:

      return Object.assign({}, state, {
        bucList: action.payload
      })

    case types.CASE_GET_BUC_LIST_FAILURE:

      return Object.assign({}, state, {
        bucList: []
      })

    case types.CASE_GET_COUNTRY_LIST_SUCCESS:

      return Object.assign({}, state, {
        countryList: action.payload
      })

    case types.CASE_DATA_PREVIEW_SUCCESS:

      return Object.assign({}, state, {
        previewData: action.payload,
        step: 1
      })

    case types.CASE_GET_MORE_PREVIEW_DATA_SUCCESS:

      let previewData = Object.assign({},
        state.previewData,
        action.payload
      )

      return Object.assign({}, state, {
        previewData: previewData
      })

    case types.CASE_CREATE_SED_REQUEST:
    case types.CASE_ADD_TO_SED_REQUEST:

      return Object.assign({}, state, {
        savedData: undefined
      })

    case types.CASE_CREATE_SED_SUCCESS:
    case types.CASE_ADD_TO_SED_SUCCESS:

      return Object.assign({}, state, {
        savedData: action.payload,
        step: 2
      })

    case types.CASE_SEND_SED_SUCCESS:

      return Object.assign({}, state, {
        dataSent: action.payload
      })

    case types.CASE_GET_CASE_NUMBER_REQUEST:

      return Object.assign({}, state, {
        currentCase: undefined
      })

    case types.CASE_GET_CASE_NUMBER_SUCCESS:

      return Object.assign({}, state, {
        currentCase: action.payload
      })

    case types.CASE_GET_CASE_NUMBER_CLEAN:

      return Object.assign({}, state, {
        currentCase: undefined
      })

    case types.RINA_GET_URL_SUCCESS:

      return Object.assign({}, state, {
        rinaUrl: action.payload.rinaUrl
      })

    case types.APP_CLEAR_DATA:

      return Object.assign({}, state, {
        currentCase: undefined,
        previewData: undefined,
        savedData: undefined,
        sentData: undefined,
        step: 0
      })

    default:
      return state
  }
}
