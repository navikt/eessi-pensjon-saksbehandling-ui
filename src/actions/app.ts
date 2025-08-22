import * as types from 'src/constants/actionTypes'
import * as urls from 'src/constants/urls'
import {ContextPayload, ParamPayload} from 'src/declarations/app.d'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockUser from 'src/mocks/app/user'
import mockCountryCodes from 'src/mocks/app/countryCodes'
import { Action } from 'redux'
import mockAktoerId from "../mocks/app/aktoerId";
import mockAvdodAktoerId from "../mocks/app/avdodAktoerId";

// @ts-ignore
import { sprintf } from 'sprintf-js';

export const clearData = (): Action => ({
  type: types.APP_DATA_CLEAR
})

export const getUserInfo = (): Action => {
  return call({
    url: urls.API_USERINFO_URL,
    cascadeFailureError: true,
    expectedPayload: mockUser,
    type: {
      request: types.APP_USERINFO_REQUEST,
      success: types.APP_USERINFO_SUCCESS,
      failure: types.APP_USERINFO_FAILURE,
      forbidden: types.APP_USERINFO_FORBIDDEN
    }
  })
}

export const getAktoerId = (fnr:string, context: string): ActionWithPayload<string> => {
  return call({
    url: sprintf(urls.PERSON_PDL_GET_AKTOERID_URL, { fnr }),
    expectedPayload: context === "aktoerId" ?
      {
        result: mockAktoerId
      } :
      {
        result: mockAvdodAktoerId
      },
    context: context,
    cascadeFailureError: true,
    type: {
      request: types.PERSON_AKTOERID_REQUEST,
      success: types.PERSON_AKTOERID_SUCCESS,
      failure: types.PERSON_AKTOERID_FAILURE
    }
  })
}

export const getCountryCodeLists = (): Action => {
  return call({
    url: urls.COUNTRYCODES_URL,
    cascadeFailureError: true,
    expectedPayload: mockCountryCodes,
    type: {
      request: types.GET_COUNTRYCODES_REQUEST,
      success: types.GET_COUNTRYCODES_SUCCESS,
      failure: types.GET_COUNTRYCODES_FAILURE,
    }
  })
}

export const setStatusParam = (
  key: string,
  value: any
): ActionWithPayload<ParamPayload> => ({
  type: types.APP_PARAM_SET,
  payload: {
    key,
    value
  } as ParamPayload
})

export const setContext = (
  context: string
): ActionWithPayload<ContextPayload> => ({
  type: types.APP_CONTEXT_SET,
  payload: {
    context
  } as ContextPayload
})

export const unsetStatusParam = (
  key: string
): ActionWithPayload<ParamPayload> => ({
  type: types.APP_PARAM_UNSET,
  payload: {
    key
  } as ParamPayload
})

export const copyToClipboard = (text: string) => ({
  type: types.APP_CLIPBOARD_COPY,
  payload: text
})

export const addEditingItem = (item: string) => ({
  type: types.APP_EDITING_ITEMS_ADD,
  payload: item
})

export const deleteEditingItem = (item: string) => ({
  type: types.APP_EDITING_ITEMS_DELETE,
  payload: item
})

export const resetEditingItems = () => ({
  type: types.APP_EDITING_ITEMS_RESET,
})

