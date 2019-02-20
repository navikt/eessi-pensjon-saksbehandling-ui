import * as types from '../constants/actionTypes'

let initialState = {
  isReady: false,
  step: 0,
  maxStep: 0,
  stepError: undefined,
  person: {},
  bank: {},
  stayAbroad: [],
  work: {},
  receipt: undefined,
  buttonsVisible: true
}

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.PINFO_STEP_SET:

      let step = action.payload
      let maxStep = state.maxStep
      if (step > maxStep) {
        maxStep = step
      }
      return Object.assign({}, state, {
        step: step,
        maxStep: maxStep,
        stepError: undefined
      })

    case types.PINFO_STEP_ERROR: {
      return Object.assign({}, state, {
        stepError: action.payload
      })
    }

    case types.PINFO_PERSON_SET:
      return Object.assign({}, state, {
        person: {
          ...state.person,
          ...action.payload
        }
      })

    case types.PINFO_WORK_SET:
      return Object.assign({}, state, {
        work: {
          ...state.work,
          ...action.payload
        }
      })

    case types.PINFO_BANK_SET:
      return Object.assign({}, state, {
        bank: {
          ...state.bank,
          ...action.payload
        }
      })

    case types.PINFO_COMMENT_SET:
      return Object.assign({}, state, {
        comment: action.payload
      })

    case types.PINFO_STAY_ABROAD_SET:

      let sortedStayAbroad = action.payload.slice()
      sortedStayAbroad.sort((a, b) => { return a.startDate - b.startDate })

      return Object.assign({}, state, {
        stayAbroad: sortedStayAbroad
      })

    case types.PINFO_SEND_SUCCESS:

      return Object.assign({}, state, {
        send: action.payload
      })

    case types.PINFO_SET_READY:

      return Object.assign({}, state, {
        isReady: true
      })

    case types.PINFO_PAGE_ERRORS_SET: {
      return Object.assign({}, state, {
        pageErrors: action.payload.pageErrors,
        errorTimestamp: action.payload.errorTimestamp
      })
    }

    case types.PINFO_SEND_FAILURE:

      return Object.assign({}, state, {
        send: undefined
      })

    case types.PINFO_RECEIPT_SUCCESS:

      return Object.assign({}, state, {
        receipt: action.payload
      })

    case types.PINFO_RECEIPT_FAILURE:

      return Object.assign({}, state, {
        receipt: undefined
      })

    case types.STORAGE_GET_SUCCESS: {
      let pinfo
      try {
        pinfo = JSON.parse(action.payload)
      } catch (e) {
        pinfo = action.payload
      }
      pinfo.buttonsVisible = true
      pinfo.isReady = true
      return Object.assign({}, initialState, pinfo)
    }

    case types.STORAGE_GET_PINFO_SUCCESS: {
      let pinfo
      try {
        pinfo = JSON.parse(action.payload)
      } catch (e) {
        pinfo = action.payload
      }
      pinfo.buttonsVisible = true
      pinfo.isReady = true
      pinfo.stepError = undefined
      return Object.assign({}, initialState, pinfo)
    }

    case types.PINFO_BUTTONS_VISIBLE: {
      return Object.assign({}, state, {
        buttonsVisible: action.payload
      })
    }

    case types.APP_CLEAR_DATA:

      return initialState

    default:

      return state
  }
}
