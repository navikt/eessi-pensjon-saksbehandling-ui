import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { PersonAvdods } from 'declarations/person'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockPerson from 'mocks/person/personPdl'
import mockPersonAvdodAktoerId from 'mocks/person/personAvdodAktoerId'
import mockPersonAvdod from 'mocks/person/personAvdod'
import mockUFT from 'mocks/person/uft'
import mockGJPBP from 'mocks/person/gjpbp'
import {Action} from "redux";
const sprintf = require('sprintf-js').sprintf

export const getPersonAvdodInfo = (
  aktoerId: string,
  vedtakId: string,
  nrAvdod: number | undefined
): ActionWithPayload<PersonAvdods> => {
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

export const getPersonAvdodInfoFromAktoerId = (
  aktoerId: string,
): ActionWithPayload<PersonAvdods> => {
  return call({
    url: sprintf(urls.PERSON_PDL_URL, { aktoerId }),
    expectedPayload: mockPersonAvdodAktoerId,
    type: {
      request: types.PERSON_AVDOD_FROM_AKTOERID_REQUEST,
      success: types.PERSON_AVDOD_FROM_AKTOERID_SUCCESS,
      failure: types.PERSON_AVDOD_FROM_AKTOERID_FAILURE
    }
  })
}

export const getPersonInfo = (
  aktoerId: string
): ActionWithPayload<any> => {
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

export const getGjpBp = (vedtakId: string, sakId: string) => {
  return call({
    url: sprintf(urls.PERSON_GJP_BP_URL, { vedtakId, sakId }),
    cascadeFailureError: true,
    expectedPayload: mockGJPBP,
    type: {
      request: types.PERSON_GJP_BP_REQUEST,
      success: types.PERSON_GJP_BP_SUCCESS,
      failure: types.PERSON_GJP_BP_FAILURE
    }
  })
}

export const setGjpBp = (): Action => ({
  type: types.PERSON_SET_GJP_BP
})


