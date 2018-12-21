import * as types from '../constants/actionTypes'
import fetch from 'cross-fetch'
import 'cross-fetch/polyfill'

export function call (options) {
  return (dispatch) => {
    dispatch({
      type: options.type.request
    })
    return fetch(options.url, {
      method: options.method || 'GET',
      crossOrigin: true,
      json: true,
      headers: options.headers,
      body: options.body || options.payload
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
        context: options.context
      })
    }).catch(error => {
      return dispatch({
        type: error.status >= 500 ? types.SERVER_ERROR : options.type.failure,
        payload: error.message
      })
    })
  }
}
