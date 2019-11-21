import * as types from 'constants/actionTypes'

export const clientClear = () => {
  return {
    type: types.ALERT_CLIENT_CLEAR
  }
}

export const clientError = (payload) => {
  return {
    type: types.ALERT_CLIENT_ERROR,
    payload: payload
  }
}
