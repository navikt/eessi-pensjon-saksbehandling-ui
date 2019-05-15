import * as types from '../constants/actionTypes'
import * as urls from '../constants/urls'
import * as api from './api'

export function login () {
  let currentHost = window.location.origin // http://hostname
  let redirect = currentHost
  let context = encodeURIComponent(window.location.pathname + window.location.search)

  let newUrl = urls.LOGIN_URL + '?redirect=' + redirect + '&context=' + context
  window.location.href = newUrl

  return {
    type: types.APP_LOGIN_REQUEST
  }
}

export function logout () {
  let redirectUrl = urls.LOGOUT_URL
  window.location.href = redirectUrl
  return {
    type: types.APP_LOGOUT_REQUEST
  }
}

export function getUserInfo () {
  return api.call({
    url: urls.API_USERINFO_URL,
    type: {
      request: types.APP_USERINFO_REQUEST,
      success: types.APP_USERINFO_SUCCESS,
      failure: types.APP_USERINFO_FAILURE
    }
  })
}

export function getAndPrefillPersonName () {
  return function (dispatch) {
    dispatch({ type: types.APP_GET_AND_PREFILL_PERSON_NAME })
    try {
      dispatch(getPersonData())
      dispatch(suggestPersonNameFromUsernameIfNotInState())
    } catch (error) {
      dispatch({ type: types.APP_GET_AND_PREFILL_PERSON_NAME_FAILURE, payload: error })
    }
  }
}

export function getPersonData () {
  return api.call({
    url: urls.API_PERSONDATA_URL,
    type: {
      request: types.APP_PERSONDATA_REQUEST,
      success: types.APP_PERSONDATA_SUCCESS,
      failure: types.APP_PERSONDATA_FAILURE
    }
  })
}

export function suggestPersonNameFromUsernameIfNotInState () {
  return function (dispatch, globalState) {
    if (!globalState.pinfo.person.nameAtBirth) {
      let lastName = globalState.app.lastName
      return dispatch({
        type: types.PINFO_PERSON_SET,
        payload: {
          nameAtBirth: lastName
        }
      })
    }
  }
}

export function clearData () {
  return {
    type: types.APP_CLEAR_DATA
  }
}

export function setReferrer (referrer) {
  return {
    type: types.APP_REFERRER_SET,
    payload: {
      referrer: referrer
    }
  }
}

export function registerDroppable (id, ref) {
  return {
    type: types.APP_DROPPABLE_REGISTER,
    payload: {
      id: id,
      ref: ref
    }
  }
}

export function unregisterDroppable (id) {
  return {
    type: types.APP_DROPPABLE_UNREGISTER,
    payload: {
      id: id
    }
  }
}
