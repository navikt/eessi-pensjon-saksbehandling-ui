import fetch from 'cross-fetch'
import { get as cookieGet } from 'browser-cookies'
import 'cross-fetch/polyfill'
import uuid from 'uuid/v4'
import * as types from 'constants/actionTypes'
import { IS_TEST } from 'constants/environment'
import { HOST } from 'constants/urls'

export const fakeCall = ({ context, expectedPayload, method, type, url }) => {
  return (dispatch) => {
    if (!IS_TEST) {
      console.log('FAKE API REQUEST FOR ' + (method || 'GET') + ' ' + url)
    }
    dispatch({
      type: type.request
    })
    return new Promise((resolve) => {
      setTimeout(() => {
        const _payload = typeof expectedPayload === 'function' ? expectedPayload() : expectedPayload
        resolve(_payload)
      }, Math.floor(Math.random() * 2000))
    }).then(payload => {
      if (!IS_TEST) {
        console.log('FAKE API SUCCESS FOR ' + (method || 'GET') + ' ' + url)
        console.log('Payload', payload)
      }
      return dispatch({
        type: type.success,
        payload: payload,
        context: context
      })
    })
  }
}

export const realCall = ({ body, context, failWith401, failWith500, headers, method, payload, type, url }) => {
  return (dispatch) => {
    dispatch({
      type: type.request
    })
    let _body = body || payload
    _body = _body ? JSON.stringify(_body) : undefined
    const CSRF_PROTECTION = cookieGet('NAV_CSRF_PROTECTION')
      ? { NAV_CSRF_PROTECTION: cookieGet('NAV_CSRF_PROTECTION') }
      : {}
    return fetch(url, {
      method: method || 'GET',
      crossOrigin: true,
      json: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Request-ID': uuid(),
        ...CSRF_PROTECTION,
        ...headers
      },
      body: _body
    }).then(response => {
      if (response.status >= 400) {
        const error = new Error(response.statusText)
        error.response = response
        error.status = response.status
        return response.json().then((json) => {
          error.message = json.message
          error.stackTrace = json.stackTrace
          throw error
        })
          .catch(() => {
            return Promise.reject(error)
          })
      } else {
        return response.json()
      }
    }).then(payload => {
      return dispatch({
        type: type.success,
        payload: payload,
        originalPayload: body,
        context: context
      })
    }).catch(error => {
      const _body = body || payload
      if (error.status === 401) {
        dispatch({
          type: types.SERVER_UNAUTHORIZED_ERROR,
          payload: error,
          originalPayload: _body,
          context: context
        })
        if (failWith401) {
          dispatch({
            type: type.failure,
            payload: error,
            originalPayload: _body,
            context: context
          })
        }
      } else if (error.status >= 500) {
        dispatch({
          type: types.SERVER_INTERNAL_ERROR,
          payload: error,
          originalPayload: _body,
          context: context
        })
        if (failWith500) {
          dispatch({
            type: type.failure,
            payload: error,
            originalPayload: _body,
            context: context
          })
        }
      } else {
        return dispatch({
          type: type.failure,
          payload: error,
          originalPayload: _body,
          context: context
        })
      }
    })
  }
}

export const call = HOST === 'localhost' && !IS_TEST ? fakeCall : realCall
