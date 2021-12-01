import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockPageNotificationRead from 'mocks/pagenotification/read'
import mockPageNotificationSet from 'mocks/pagenotification/set'
import { ActionCreator } from 'redux'

export const readNotification: ActionCreator<ThunkResult<ActionWithPayload<any>>> = (
): ThunkResult<ActionWithPayload<any>> => {
  return call({
    url: urls.API_PAGENOTIFICATION_GET_URL,
    expectedPayload: mockPageNotificationRead,
    type: {
      request: types.PAGE_NOTIFICATION_READ_REQUEST,
      success: types.PAGE_NOTIFICATION_READ_SUCCESS,
      failure: types.PAGE_NOTIFICATION_READ_FAILURE
    }
  })
}

export const setNotification: ActionCreator<ActionWithPayload<undefined>> = (
  message: string, show: boolean, byline: string
): ActionWithPayload<undefined> => {
  return call({
    url: urls.API_PAGENOTIFICATION_POST_URL,
    expectedPayload: mockPageNotificationSet,
    method: 'POST',
    payload: {
      message: message,
      show: show,
      byline: byline
    },
    type: {
      request: types.PAGE_NOTIFICATION_SET_REQUEST,
      success: types.PAGE_NOTIFICATION_SET_SUCCESS,
      failure: types.PAGE_NOTIFICATION_SET_FAILURE
    }
  })
}
