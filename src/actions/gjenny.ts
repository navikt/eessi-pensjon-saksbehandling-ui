import {ActionWithPayload, call} from "@navikt/fetch";
import {Buc, BUCOptions, Bucs, NewBucPayload, NewSedPayload, Sed} from "../declarations/buc";
import * as urls from "../constants/urls";
import mockBucsGjenlevende from 'src/mocks/buc/bucsListGjenlevende'
import mockBucsAvdod from 'src/mocks/buc/bucsListAvdod'
import * as types from "../constants/actionTypes";
import mockBucOptionsGjenny from "../mocks/gjenny/bucOptionsGjenny";
import mockCreateSed from "../mocks/buc/createSed";
import {Action} from "redux";
import mockCreateBuc from "../mocks/buc/createBuc";
import {P5000SED} from "../declarations/p5000";

// @ts-ignore
import { sprintf } from 'sprintf-js';

export const fetchBucsListForGjenlevende = (
  aktoerId: string,
  howManyBucLists?: number
): ActionWithPayload<Bucs> => {
  return call({
    url: sprintf(urls.GJENNY_GET_BUCSLIST_GJENLEVENDE_URL, { aktoerId }),
    cascadeFailureError: true,
    expectedPayload: mockBucsGjenlevende(aktoerId),
    context: {
      howManyBucLists: howManyBucLists ? howManyBucLists : 2
    },
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

export const createBucGjenny = (
  params: NewBucPayload
): Action => {
  return call({
    url: sprintf(urls.GJENNY_CREATE_BUC_URL, { buc: params.buc }),
    method: 'POST',
    body: {
      sakType: params.sakType,
      sakId: params.sakId
    },
    //  these are params collected on create BUC and have to be passed later so that
    // create SED either just displays them, or decides if should ask for them again
    context: {
      avdod: params.avdod,
      avdodfnr: params.avdodfnr,
      person: params.person,
      kravDato: params.kravDato
    },
    cascadeFailureError: true,
    expectedPayload: mockCreateBuc(params.buc),
    type: {
      request: types.GJENNY_CREATE_BUC_REQUEST,
      success: types.GJENNY_CREATE_BUC_SUCCESS,
      failure: types.GJENNY_CREATE_BUC_FAILURE
    }
  })
}


export const createSedGjenny = (
  buc: Buc, payload: NewSedPayload
): ActionWithPayload<Sed> => {
  return call({
    url: urls.GJENNY_CREATE_SED_URL,
    payload,
    context: {
      buc,
      sed: payload
    },
    expectedPayload: mockCreateSed(payload),
    cascadeFailureError: true,
    method: 'POST',
    type: {
      request: types.GJENNY_CREATE_SED_REQUEST,
      success: types.GJENNY_CREATE_SED_SUCCESS,
      failure: types.GJENNY_CREATE_SED_FAILURE
    }
  })
}

export const createReplySedGjenny = (
  buc: Buc, payload: NewSedPayload, parentId: string
): ActionWithPayload<Sed> => {
  return call({
    url: sprintf(urls.GJENNY_CREATE_REPLY_SED_URL, { parentId }),
    payload,
    context: {
      buc,
      sed: payload
    },
    expectedPayload: mockCreateSed(payload),
    cascadeFailureError: true,
    method: 'POST',
    type: {
      request: types.GJENNY_CREATE_REPLY_SED_REQUEST,
      success: types.GJENNY_CREATE_REPLY_SED_SUCCESS,
      failure: types.GJENNY_CREATE_REPLY_SED_FAILURE
    }
  })
}

export const sendP5000toRinaGjenny = (
  caseId: string, sedId: string, payload: P5000SED
): Action => {
  return call({
    url: sprintf(urls.GJENNY_P5000_PUT_URL, { caseId, sedId }),
    method: 'PUT',
    body: payload,
    cascadeFailureError: true,
    expectedPayload: { success: true },
    context: {
      caseId,
      sedId,
      payload
    },
    type: {
      request: types.P5000_SEND_REQUEST,
      success: types.P5000_SEND_SUCCESS,
      failure: types.P5000_SEND_FAILURE
    }
  })
}
