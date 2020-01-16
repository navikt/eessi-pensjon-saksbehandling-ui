import * as types from 'constants/actionTypes'
import { Action, ActionWithPayload, ErrorPayload } from 'eessi-pensjon-ui/dist/declarations/types'

export const clientClear = (): Action => ({
  type: types.ALERT_CLIENT_CLEAR
})

export const clientError = (payload: ErrorPayload): ActionWithPayload<ErrorPayload> => ({
  type: types.ALERT_CLIENT_ERROR,
  payload: payload
})
