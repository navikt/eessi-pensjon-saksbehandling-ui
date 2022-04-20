import * as types from 'constants/actionTypes'
import * as Sentry from '@sentry/browser'
import { AnyAction } from 'redux'

export interface SentryState {
  error: any
}

export const initialSentryState: SentryState = {
  error: undefined
}

export interface ApiRejectedAction extends AnyAction {
  error: any
  originalPayload: any
  context: any
}

const sentryReducer = (state: SentryState = initialSentryState, action: AnyAction) => {
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
