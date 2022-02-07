import { generateKeyForListRow } from 'applications/P5000/conversion'
import * as types from 'constants/actionTypes'
import { P5000FromRinaMap } from 'declarations/buc'
import { P5000Period } from 'declarations/p5000'
import { ActionWithPayload } from '@navikt/fetch'
import _ from 'lodash'
import { Action } from 'redux'

export interface P5000State {
  p5000FromRinaMap: P5000FromRinaMap
  sentP5000info: any
  gjpbpwarning: any | undefined
}

export const initialP5000State: P5000State = {
  p5000FromRinaMap: {},
  sentP5000info: undefined,
  gjpbpwarning: undefined
}

const fillWithKeys = (payload: any, sedid: string) => {
  payload?.pensjon?.medlemskapboarbeid?.medlemskap?.forEach((p: P5000Period, index: number) => {
    payload.pensjon.medlemskapboarbeid.medlemskap[index] = {
      ...p,
      key: generateKeyForListRow(sedid, p)
    }
  })
  payload?.pensjon?.trygdetid?.forEach((p: P5000Period, index: number) => {
    payload.pensjon.trygdetid[index] = {
      ...p,
      key: generateKeyForListRow(sedid, p)
    }
  })
  payload?.pensjon?.medlemskapTotal?.forEach((p: P5000Period, index: number) => {
    payload.pensjon.medlemskapTotal[index] = {
      ...p,
      key: generateKeyForListRow(sedid, p)
    }
  })
}

const p5000Reducer = (state: P5000State = initialP5000State, action: Action | ActionWithPayload = { type: '' }): P5000State => {
  switch (action.type) {
    case types.APP_CLEAR_DATA: {
      return initialP5000State
    }

    case types.BUC_BUC_RESET:
    case types.BUC_SED_RESET:
      return {
        ...state,
        p5000FromRinaMap: {}
      }

    case types.P5000_SEND_RESET:
    case types.P5000_SEND_REQUEST:
      return {
        ...state,
        sentP5000info: undefined
      }

    case types.P5000_SEND_SUCCESS: {
      const sedId = (action as ActionWithPayload).context.sedId
      const p5000saved = (action as ActionWithPayload).context.payload
      const newP5000FromRinaMap = _.cloneDeep(state.p5000FromRinaMap)

      if (Object.prototype.hasOwnProperty.call(newP5000FromRinaMap, sedId)) {
        fillWithKeys(p5000saved, sedId)
        newP5000FromRinaMap[sedId] = p5000saved
      }
      return {
        ...state,
        p5000FromRinaMap: newP5000FromRinaMap,
        sentP5000info: (action as ActionWithPayload).payload
      }
    }

    case types.P5000_SEND_FAILURE:
      return {
        ...state,
        sentP5000info: null
      }

    case types.P5000_GJPBPWARNING_SET:
      return {
        ...state,
        gjpbpwarning: (action as ActionWithPayload).payload
      }

    case types.P5000_GET_SUCCESS: {
      const newp5000FromRina = _.cloneDeep(state.p5000FromRinaMap)
      const payload = (action as ActionWithPayload).payload
      const sedId = (action as ActionWithPayload).context.id
      fillWithKeys(payload, sedId)
      newp5000FromRina[sedId] = payload
      return {
        ...state,
        p5000FromRinaMap: newp5000FromRina
      }
    }

    default:
      return state
  }
}

export default p5000Reducer
