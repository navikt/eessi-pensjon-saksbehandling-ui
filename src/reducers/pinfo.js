import * as types from '../constants/actionTypes'

let initialState = {
  form: {
    isLoaded: false,
    step: 0,
    maxstep: 6,
    validationError: undefined,
    contact: {
      phone: {},
      email: {}
    }
  }
}

function omit (key, object) {
  let { [key]: remove, ...rest } = object
  return rest
}

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.PINFO_EVENT_SET_PROPERTY:

      return { ...state, form: { ...state.form, ...action.payload } }

    case types.STORAGE_GET_SUCCESS:
      let form = JSON.parse(action.payload).form
      return form
        ? { ...state, form: form }
        : state

    case types.PINFO_EVENT_SET_PHONE:

      return {
        ...state,
        form: {
          ...state.form,
          contact: {
            ...state.form.contact,
            phone: {
              ...state.form.contact.phone,
              [action.key]: {
                ...state.form.contact.phone[action.key],
                ...action.payload
              } } } } }

    case types.PINFO_EVENT_REMOVE_PHONE:
      return {
        ...state,
        form: {
          ...state.form,
          contact: {
            ...state.form.contact,
            phone: omit(action.key, state.form.contact.phone)
          } } }

    case types.PINFO_EVENT_SET_EMAIL:

      return {
        ...state,
        form: {
          ...state.form,
          contact: {
            ...state.form.contact,
            email: {
              ...state.form.contact.email,
              [action.key]: {
                ...state.form.contact.email[action.key],
                ...action.payload
              } } } } }

    case types.PINFO_EVENT_REMOVE_EMAIL:
      return {
        ...state,
        form: {
          ...state.form,
          contact: {
            ...state.form.contact,
            email: omit(action.key, state.form.contact.email)
          } } }

    case types.PINFO_NEW:

      break

    case types.APP_CLEAR_DATA:

      return initialState

    default:

      return state
  }
}
