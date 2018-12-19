import request from 'request'
import * as types from '../constants/actionTypes'

export function call (options) {
  return (dispatch) => {
    dispatch({
      type: options.type.request
    })
    request({
      url: options.url,
      method: options.method || 'GET',
      crossOrigin: true,
      json: true,
      headers: options.headers,
      body: options.body || options.payload
    }, function (error, response, body) {
      if (error || !response) {
        return dispatch({
          type: types.SERVER_OFFLINE
        })
      }
      return dispatch({
        type: response.statusCode >= 400 ? options.type.failure : options.type.success,
        payload: body,
        context: options.context,
      })
    })
  }
}
