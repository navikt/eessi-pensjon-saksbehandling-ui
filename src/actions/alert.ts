import * as types from 'constants/actionTypes'
import { Action, SimpleAction, ErrorPayload } from './actions' // eslint-disable-line

export const clientClear = (): SimpleAction => ({
  type: types.ALERT_CLIENT_CLEAR
})

export const clientError = (payload: ErrorPayload): Action<ErrorPayload> => {
  return {
    type: types.ALERT_CLIENT_ERROR,
    payload: payload
  }
}
