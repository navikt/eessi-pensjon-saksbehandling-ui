import fetch from 'cross-fetch'
import cookies from 'browser-cookies'
import 'cross-fetch/polyfill'
import * as types from 'constants/actionTypes'
import { IS_TEST } from 'constants/environment'
import { HOST } from 'constants/urls'

export const fakecall = (options) => {
  return (dispatch) => {
    console.log('FAKE API CALL FOR ' + options.url + ': REQUEST')
    dispatch({
      type: options.type.request
    })
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(options.expectedPayload)
      }, Math.floor(Math.random() * 2000))
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
    const CSRF_PROTECTION = cookies.get('NAV_CSRF_PROTECTION')
      ? { NAV_CSRF_PROTECTION: cookies.get('NAV_CSRF_PROTECTION') }
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
        const error = new Error(response.statusText)
        error.response = response
        error.status = response.status
        return response.json().then((json) => {
          const { message, stackTrace } = json
          error.message = message
          error.stackTrace = stackTrace
          throw error
        })
          .catch((e) => {
            return Promise.reject(error)
          })
      } else {
        return response.json()
      }
    }).then(payload => {
      return dispatch({
        type: options.type.success,
        payload: payload,
        originalPayload: body,
        context: options.context
      })
    }).catch(error => {
      const body = options.body || options.payload
      if (error.status === 401) {
        dispatch({
          type: types.SERVER_UNAUTHORIZED_ERROR,
          payload: error,
          originalPayload: body,
          context: options.context
        })
      } else if (error.status >= 500) {
        dispatch({
          type: types.SERVER_INTERNAL_ERROR,
          payload: error,
          originalPayload: body,
          context: options.context
        })
      } else {
        return dispatch({
          type: options.type.failure,
          payload: error,
          originalPayload: body,
          context: options.context
        })
      }
    })
  }
}

export const funcCall = HOST === 'localhost' && !IS_TEST ? fakecall : call
