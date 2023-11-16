import {ActionWithPayload, call} from "@navikt/fetch";
import {BUCOptions, Bucs} from "../declarations/buc";
import * as urls from "../constants/urls";
import mockBucsGjenlevende from 'mocks/buc/bucsListGjenlevende'
import mockBucsAvdod from 'mocks/buc/bucsListAvdod'
import * as types from "../constants/actionTypes";
import mockBucOptionsGjenny from "../mocks/gjenny/bucOptionsGjenny";

const sprintf = require('sprintf-js').sprintf

export const fetchBucsListForGjenlevende = (
  aktoerId: string
): ActionWithPayload<Bucs> => {
  return call({
    url: sprintf(urls.GJENNY_GET_BUCSLIST_GJENLEVENDE_URL, { aktoerId }),
    cascadeFailureError: true,
    expectedPayload: mockBucsGjenlevende(aktoerId),
    type: {
      request: types.GJENNY_GET_BUCSLIST_FOR_GJENLEVENDE_REQUEST,
      success: types.GJENNY_GET_BUCSLIST_FOR_GJENLEVENDE_SUCCESS,
      failure: types.GJENNY_GET_BUCSLIST_FOR_GJENLEVENDE_FAILURE
    }
  })
}

export const fetchBucsListForAvdod = (
  aktoerId: string, avdodFnr: string
): ActionWithPayload<Bucs> => {
  return call({
    url: sprintf(urls.GJENNY_GET_BUCSLIST_FOR_AVDOD_URL, { aktoerId, avdodFnr }),
    cascadeFailureError: true,
    expectedPayload: mockBucsAvdod(aktoerId, avdodFnr),
    type: {
      request: types.GJENNY_GET_BUCSLIST_FOR_AVDOD_REQUEST,
      success: types.GJENNY_GET_BUCSLIST_FOR_AVDOD_SUCCESS,
      failure: types.GJENNY_GET_BUCSLIST_FOR_AVDOD_FAILURE
    }
  })
}

export const getBucOptionsGjenny = (): ActionWithPayload<BUCOptions> => {
  return call({
    url: sprintf(urls.GJENNY_GET_BUC_OPTIONS_URL),
    expectedPayload: mockBucOptionsGjenny,
    type: {
      request: types.GJENNY_GET_BUC_OPTIONS_REQUEST,
      success: types.GJENNY_GET_BUC_OPTIONS_SUCCESS,
      failure: types.GJENNY_GET_BUC_OPTIONS_FAILURE
    }
  })
}
