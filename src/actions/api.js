import * as types from '../constants/actionTypes'
import fetch from 'cross-fetch'
import cookies from 'browser-cookies'
import 'cross-fetch/polyfill'

export const fakecall = (options) => {
  return (dispatch) => {
    console.log('FAKE API CALL FOR ' + options.url + ': REQUEST')
    dispatch({
      type: options.type.request
    })
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(options.expectedPayload)
      }, 1000)
    }).then(payload => {
      console.log('FAKE API CALL FOR ' + options.url + ': SUCCESS')
      return dispatch({
        type: options.type.success,
        payload: payload,
        context: options.context
      })
    })
  }
}

export const call = (options) => {
  return (dispatch) => {
    dispatch({
      type: options.type.request
    })
    let body = options.body || options.payload
    body = body ? JSON.stringify(body) : undefined
    let CSRF_PROTECTION = cookies.get('NAV_CSRF_PROTECTION')
      ? { 'NAV_CSRF_PROTECTION': cookies.get('NAV_CSRF_PROTECTION') }
      : {}
    return fetch(options.url, {
      method: options.method || 'GET',
      crossOrigin: true,
      json: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...CSRF_PROTECTION,
        ...options.headers
      },
      body: body
    }).then(response => {
      if (response.status >= 400) {
        var error = new Error(response.statusText)
        error.response = response
        error.status = response.status
        throw error
      } else {
        return response
      }
    }).then(response => {
      return response.json()
    }).then(payload => {
      return dispatch({
        type: options.type.success,
        payload: payload,
        originalPayload: body,
        context: options.context
      })
    }).catch(error => {
      if (error.status === 401) {
        dispatch({
          type: types.SERVER_UNAUTHORIZED_ERROR,
          payload: error.message,
          originalPayload: body,
          context: options.context
        })
      }
      if (error.status >= 500) {
        dispatch({
          type: types.SERVER_INTERNAL_ERROR,
          payload: error.message,
          originalPayload: body,
          context: options.context
        })
      }
      return dispatch({
        type: options.type.failure,
        payload: error.message,
        originalPayload: body,
        context: options.context
      })
    })
  }
}
