import * as types from 'constants/actionTypes'
import { Action, PayloadError } from './actions' // eslint-disable-line

export const clientClear = (): Action<PayloadError> => ({
  type: types.ALERT_CLIENT_CLEAR
})

export const clientError = (payload: PayloadError): Action<PayloadError> => {
  return {
    type: types.ALERT_CLIENT_ERROR,
    payload: payload
  }
}
