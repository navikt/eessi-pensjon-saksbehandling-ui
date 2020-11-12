import * as types from 'constants/actionTypes'
import * as Sentry from '@sentry/browser'
import { Action } from 'redux'

export interface SentryState {
  error: any
}

export const initialSentryState: SentryState = {
  error: undefined
}

export interface ApiRejectedAction extends Action {
  error: any
  originalPayload: any
  context: any
}

const sentryReducer = (state: SentryState = initialSentryState, action: ApiRejectedAction = {
  type: '', error: undefined, originalPayload: undefined, context: undefined
}) => {
  switch (action.type) {
    case types.API_CALL_REJECTED:

      Sentry.captureEvent({
        message: action.error.message,
        extra: {
          error: action.error,
          originalPayload: action.originalPayload,
          context: action.context
        },
        level: Sentry.Severity.Error
      })

      return {
        ...state,
        error: action.error
      }

    default:
      return state
  }
}

export default sentryReducer
