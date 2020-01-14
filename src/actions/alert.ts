import * as types from 'constants/actionTypes'
import { Action, ActionWithPayload, ErrorPayload } from 'types.d'

export const clientClear = (): Action => ({
  type: types.ALERT_CLIENT_CLEAR
})

export const clientError = (payload: ErrorPayload): ActionWithPayload<ErrorPayload> => {
  return {
    type: types.ALERT_CLIENT_ERROR,
    payload: payload
  }
}
