import * as types from '../constants/actionTypes'

export default function (state = {}, action = {}) {
  switch (action.type) {
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
        bucList: undefined
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

    case types.CASE_CONFIRM_DATA_SUCCESS:

      return Object.assign({}, state, {
        dataToConfirm: action.payload
      })

    case types.CASE_CONFIRM_DATA_CLEAN:

      return Object.assign({}, state, {
        dataToConfirm: undefined
      })

    case types.CASE_GENERATE_DATA_SUCCESS:

      let dataToGenerate = Object.assign({},
        state.dataToConfirm,
        action.payload
      )

      return Object.assign({}, state, {
        dataToGenerate: dataToGenerate
      })

    case types.CASE_GENERATE_DATA_CLEAN:

      return Object.assign({}, state, {
        dataToGenerate: undefined
      })

    case types.CASE_CREATE_SED_REQUEST:
    case types.CASE_ADD_TO_SED_REQUEST:

      return Object.assign({}, state, {
        dataSaved: undefined
      })

    case types.CASE_CREATE_SED_SUCCESS:
    case types.CASE_ADD_TO_SED_SUCCESS:

      return Object.assign({}, state, {
        dataSaved: action.payload
      })

    case types.CASE_SAVE_DATA_CLEAN: {
      return Object.assign({}, state, {
        dataSaved: undefined
      })
    }

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
        rinaUrl: action.payload
      })

    case types.APP_CLEAR_DATA:

      return Object.assign({}, state, {
        currentCase: undefined,
        dataToGenerate: undefined,
        dataToConfirm: undefined,
        dataSaved: undefined
      })

    default:
      return state
  }
}
