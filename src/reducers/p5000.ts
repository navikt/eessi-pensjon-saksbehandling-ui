import { generateKeyForListRow } from 'src/applications/P5000/utils/conversionUtils'
import * as types from 'src/constants/actionTypes'
import { P5000sFromRinaMap, P5000Period, P5000ListRows } from 'src/declarations/p5000'
import { ActionWithPayload } from '@navikt/fetch'
import _ from 'lodash'
import { AnyAction } from 'redux'

export interface P5000State {
  p5000sFromRinaMap: P5000sFromRinaMap
  p5000sFromS3: Array<P5000ListRows> | null | undefined
  sentP5000info: any
  gjpbpwarning: any | undefined
}

export const initialP5000State: P5000State = {
  p5000sFromRinaMap: {},
  p5000sFromS3: undefined,
  sentP5000info: undefined,
  gjpbpwarning: undefined
}

const fillWithKeys = (payload: any, sedId: string) => {
  payload?.pensjon?.medlemskapboarbeid?.medlemskap?.forEach((p: P5000Period, index: number) => {
    payload.pensjon.medlemskapboarbeid.medlemskap[index] = {
      ...p,
      options: {
        key: generateKeyForListRow(sedId, p),
        sedId
      }
    } as P5000Period
  })
  payload?.pensjon?.trygdetid?.forEach((p: P5000Period, index: number) => {
    payload.pensjon.trygdetid[index] = {
      ...p,
      options: {
        key: generateKeyForListRow(sedId, p),
        sedId
      }
    } as P5000Period
  })
  payload?.pensjon?.medlemskapTotal?.forEach((p: P5000Period, index: number) => {
    payload.pensjon.medlemskapTotal[index] = {
      ...p,
      options: {
        key: generateKeyForListRow(sedId, p),
        sedId
      }
    } as P5000Period
  })
}

const p5000Reducer = (state: P5000State = initialP5000State, action: AnyAction): P5000State => {
  switch (action.type) {
    case types.APP_DATA_CLEAR: {
      return initialP5000State
    }

    case types.BUC_BUC_RESET:
    case types.BUC_SED_RESET:
      return {
        ...state,
        p5000sFromRinaMap: {}
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
      const newP5000FromRinaMap = _.cloneDeep(state.p5000sFromRinaMap)

      if (Object.prototype.hasOwnProperty.call(newP5000FromRinaMap, sedId)) {
        fillWithKeys(p5000saved, sedId)
        newP5000FromRinaMap[sedId] = p5000saved
      }
      return {
        ...state,
        p5000sFromRinaMap: newP5000FromRinaMap,
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

    case types.P5000_PESYS_GET_REQUEST: {
      return {
        ...state,
        p5000sFromS3: undefined
      }
    }

    case types.P5000_PESYS_GET_FAILURE: {
      return {
        ...state,
        p5000sFromS3: null
      }
    }

    case types.P5000_PESYS_GET_SUCCESS: {
      return {
        ...state,
        p5000sFromS3: (action as ActionWithPayload).payload
      }
    }

    case types.P5000_GET_SUCCESS: {
      const newp5000FromRina = _.cloneDeep(state.p5000sFromRinaMap)
      const payload = (action as ActionWithPayload).payload
      const sedId = (action as ActionWithPayload).context.id
      fillWithKeys(payload, sedId)
      newp5000FromRina[sedId] = _.cloneDeep(payload)
      return {
        ...state,
        p5000sFromRinaMap: newp5000FromRina
      }
    }

    default:
      return state
  }
}

export default p5000Reducer
