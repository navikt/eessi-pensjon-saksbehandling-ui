import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { PersonAvdods, PersonPDL } from 'declarations/person'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockPerson from 'mocks/person/personPdl'
import mockPersonAvdod from 'mocks/person/personAvdod'
import { ActionCreator } from 'redux'
const sprintf = require('sprintf-js').sprintf

export const getPersonAvdodInfo: ActionCreator<ThunkResult<ActionWithPayload<PersonAvdods>>> = (
  aktoerId: string,
  vedtakId: string,
  nrAvdod: number | undefined
): ThunkResult<ActionWithPayload<PersonAvdods>> => {
  return call({
    url: sprintf(urls.PERSON_AVDOD_URL, { aktoerId, vedtakId }),
    expectedPayload: /* istanbul ignore next */ mockPersonAvdod(nrAvdod),
    type: {
      request: types.PERSON_AVDOD_REQUEST,
      success: types.PERSON_AVDOD_SUCCESS,
      failure: types.PERSON_AVDOD_FAILURE
    }
  })
}

export const getPersonInfo: ActionCreator<ThunkResult<ActionWithPayload<PersonPDL>>> = (
  aktoerId: string
): ThunkResult<ActionWithPayload<PersonPDL>> => {
  return call({
    url: sprintf(urls.PERSON_PDL_URL, { aktoerId }),
    expectedPayload: mockPerson,
    type: {
      request: types.PERSON_PDL_REQUEST,
      success: types.PERSON_PDL_SUCCESS,
      failure: types.PERSON_PDL_FAILURE
    }
  })
}
