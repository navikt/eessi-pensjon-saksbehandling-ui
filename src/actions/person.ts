import * as types from 'src/constants/actionTypes'
import * as urls from 'src/constants/urls'
import { PersonAvdods } from 'src/declarations/person'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockPerson from 'src/mocks/person/personPdl'
import mockPersonAvdodAktoerId from 'src/mocks/person/personAvdodAktoerId'
import mockPersonAvdod from 'src/mocks/person/personAvdod'
import mockUFT from 'src/mocks/person/uft'
import mockGJPBP from 'src/mocks/person/gjpbp'
import {Action} from "redux";

// @ts-ignore
import { sprintf } from 'sprintf-js';

export const getPersonAvdodInfo = (
  aktoerId: string,
  vedtakId: string,
  nrAvdod: number | undefined
): ActionWithPayload<PersonAvdods> => {
  return call({
    url: sprintf(urls.PERSON_AVDOD_URL, { aktoerId, vedtakId }),
    expectedPayload: /* istanbul ignore next */ {
      result: mockPersonAvdod(nrAvdod)
    },
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
    expectedPayload: {
      result: mockPersonAvdodAktoerId
    },
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
    expectedPayload: {
      result: mockPerson
    },
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
    expectedPayload: {
      result: mockGJPBP
    },
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

export const clearPersonData = (): Action => ({
  type: types.PERSON_DATA_CLEAR
})

