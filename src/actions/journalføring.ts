import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockJournalføringSed from 'mocks/journalføring/sed'
import mockJournalføringSend from 'mocks/journalføring/send'
const sprintf = require('sprintf-js').sprintf

export const getSed = (
  sakId: string, aktoerId: string
): ActionWithPayload<any> => {
  return call({
    url: sprintf(urls.JOURNALFØRING_SED_GET_URL, { aktoerId, sakId }),
    expectedPayload: mockJournalføringSed,
    type: {
      request: types.JOURNALFØRING_SED_GET_REQUEST,
      success: types.JOURNALFØRING_SED_GET_SUCCESS,
      failure: types.JOURNALFØRING_SED_GET_FAILURE
    }
  })
}

export const jornalføreSed = (
  sakId: string, aktoerId: string, sedId: string
): ActionWithPayload<any> => {
  return call({
    url: sprintf(urls.JOURNALFØRING_SED_SEND_URL, { aktoerId, sakId, sedId }),
    expectedPayload: mockJournalføringSend,
    type: {
      request: types.JOURNALFØRING_SED_SEND_REQUEST,
      success: types.JOURNALFØRING_SED_SEND_SUCCESS,
      failure: types.JOURNALFØRING_SED_SEND_FAILURE
    }
  })
}
