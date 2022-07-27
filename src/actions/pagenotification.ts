import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockPageNotificationRead from 'mocks/pagenotification/read'
import mockPageNotificationSet from 'mocks/pagenotification/set'

export const readNotification = (
): ActionWithPayload<any> => {
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

export const deleteNotification = () => {
  return call({
    url: urls.API_PAGENOTIFICATION_DELETE_URL,
    expectedPayload: { success: true },
    method: 'DELETE',
    type: {
      request: types.PAGE_NOTIFICATION_DELETE_REQUEST,
      success: types.PAGE_NOTIFICATION_DELETE_SUCCESS,
      failure: types.PAGE_NOTIFICATION_DELETE_FAILURE
    }
  })
}

export const setNotification = (
  message: string, show: boolean, byline: string
): ActionWithPayload<undefined> => {
  return call({
    url: urls.API_PAGENOTIFICATION_POST_URL,
    expectedPayload: mockPageNotificationSet,
    method: 'POST',
    payload: {
      message,
      show,
      byline
    },
    type: {
      request: types.PAGE_NOTIFICATION_SET_REQUEST,
      success: types.PAGE_NOTIFICATION_SET_SUCCESS,
      failure: types.PAGE_NOTIFICATION_SET_FAILURE
    }
  })
}
