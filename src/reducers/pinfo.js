import * as types from '../constants/actionTypes'

let initialState = {
  form: {
    isLoaded: false,
    step: 0,
    maxstep: 6,
    validationError: undefined,
    contact: {
      phones: [],
      emails: []
    },
    attachments: {},
    bank: {},
    workIncome: {},
    pension: {}
  }
}

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.PINFO_EVENT_SET_PROPERTY:

      return { ...state, form: { ...state.form, ...action.payload } }

    case types.STORAGE_GET_SUCCESS:
      return action.fileName === 'PINFO'
        ? JSON.parse(action.payload)
        : state

    case types.PINFO_EVENT_SET_PHONES:

      return {
        ...state,
        form: {
          ...state.form,
          contact: {
            ...state.form.contact,
            phones: action.payload
      } } }

    case types.PINFO_EVENT_SET_EMAILS:
      return {
        ...state,
        form: {
          ...state.form,
          contact: {
            ...state.form.contact,
            emails: action.payload
      } } }

    case types.PINFO_EVENT_SET_WORKINCOME:
      return {
        ...state,
        form: {
          ...state.form,
          workIncome: {
            ...state.form.workIncome,
            ...action.payload
          } } }

    case types.PINFO_EVENT_SET_BANK:
      return {
        ...state,
        form: {
          ...state.form,
          bank: {
            ...state.form.bank,
            ...action.payload
          } } }

    case types.PINFO_EVENT_SET_PENSION:
      return {
        ...state,
        form: {
          ...state.form,
          pension: {
            ...state.form.pension,
            ...action.payload
          } } }

    case types.PINFO_EVENT_SET_ATTACHMENT_TYPES:
      return {
        ...state,
        form: {
          ...state.form,
          attachments: {
            ...state.form.attachments,
            attachmentTypes: {
              ...state.form.attachments.attachmentTypes,
              ...action.payload
            } } } }

    case types.PINFO_EVENT_SET_ATTACHMENTS:
      return {
        ...state,
        form: {
          ...state.form,
          attachments: {
            ...state.form.attachments,
            attachments: action.payload
          } } }

    case types.PINFO_NEW:

      break

    case types.APP_CLEAR_DATA:

      return initialState

    default:

      return state
  }
}
