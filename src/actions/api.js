import * as types from '../constants/actionTypes'
import fetch from 'cross-fetch'
import cookies from 'browser-cookies'
import 'cross-fetch/polyfill'

export function call (options) {
  return (dispatch) => {
    dispatch({
      type: options.type.request
    })
    let body = options.body || options.payload
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
      body: body ? JSON.stringify(body) : undefined
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
        payload: payload
      })
    }).catch(error => {
      if (error.status === 401) {
        dispatch({
          type: types.SERVER_UNAUTHORIZED_ERROR,
          payload: error.message
        })
      }
      if (error.status >= 500) {
        dispatch({
          type: types.SERVER_INTERNAL_ERROR,
          payload: error.message
        })
      }
      return dispatch({
        type: options.type.failure,
        payload: error.message
      })
    })
  }
}
