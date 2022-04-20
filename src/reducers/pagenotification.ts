import * as types from 'constants/actionTypes'
import { ActionWithPayload } from '@navikt/fetch'
import { AnyAction } from 'redux'

export interface PageNotificationState {
  byline: string | null | undefined
  message: string | null | undefined
  show: boolean | undefined
  response: any | null | undefined
}

export const initialPageNotificationState: PageNotificationState = {
  message: undefined,
  response: undefined,
  show: undefined,
  byline: undefined
}

const pageNotificationReducer = (state: PageNotificationState = initialPageNotificationState, action: AnyAction) => {
  switch (action.type) {
    case types.PAGE_NOTIFICATION_READ_REQUEST:
      return {
        ...state,
        message: undefined,
        show: undefined,
        byline: undefined
      }

    case types.PAGE_NOTIFICATION_READ_FAILURE:
      return {
        ...state,
        message: null
      }

    case types.PAGE_NOTIFICATION_READ_SUCCESS:
      return {
        ...state,
        message: (action as ActionWithPayload).payload.message,
        show: (action as ActionWithPayload).payload.show,
        byline: (action as ActionWithPayload).payload.byline
      }

    case types.PAGE_NOTIFICATION_SET_REQUEST:
      return {
        ...state,
        response: undefined
      }

    case types.PAGE_NOTIFICATION_SET_FAILURE:
      return {
        ...state,
        response: null
      }

    case types.PAGE_NOTIFICATION_SET_SUCCESS:
      return {
        ...state,
        response: (action as ActionWithPayload).payload.message
      }

    default:
      return state
  }
}

export default pageNotificationReducer
