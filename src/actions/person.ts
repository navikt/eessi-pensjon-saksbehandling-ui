import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { PersonAvdods, PersonPDL } from 'declarations/person'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockPerson from 'mocks/person/personPdl'
import mockPersonAvdod from 'mocks/person/personAvdod'
import { ActionCreator } from 'redux'
import mockUFT from 'mocks/person/uft'
import mockGJPBP from 'mocks/person/personAvdodPdl'
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

export const getUFT = (vedtakId: string) => {
  return call({
    url: sprintf(urls.PERSON_UFT_URL, { vedtakId }),
    cascadeFailureError: true,
    expectedPayload: mockUFT,
    type: {
      request: types.PERSON_UFT_REQUEST,
      success: types.PERSON_UFT_SUCCESS,
      failure: types.PERSON_UFT_FAILURE
    }
  })
}

export const getGjpBp = (fnr: string) => {
  return call({
    // accepts fnr as param
    url: sprintf(urls.PERSON_PDL_URL, { aktoerId: fnr }),
    cascadeFailureError: true,
    expectedPayload: mockGJPBP,
    type: {
      request: types.PERSON_GJP_BP_REQUEST,
      success: types.PERSON_GJP_BP_SUCCESS,
      failure: types.PERSON_GJP_BP_FAILURE
    }
  })
}
