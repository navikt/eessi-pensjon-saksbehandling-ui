import { generateKeyForListRow } from 'applications/P5000/conversion'
import * as types from 'constants/actionTypes'
import { LocalStorageEntry, LocalStorageValue } from 'declarations/app'
import { P5000FromRinaMap } from 'declarations/buc'
import { P5000Period, P5000SED } from 'declarations/p5000'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import { Action } from 'redux'
import { asyncLocalStorage } from 'utils/asyncLocalStorage'

export interface P5000State {
  p5000FromRinaMap: P5000FromRinaMap
  sentP5000info: any
  p5000Storage: LocalStorageEntry<P5000SED> | undefined
  p5000StorageKey: string | undefined
}

export const initialP5000State: P5000State = {
  p5000FromRinaMap: {},
  sentP5000info: undefined,
  p5000Storage: undefined,
  p5000StorageKey: undefined
}

const p5000Reducer = (state: P5000State = initialP5000State, action: Action | ActionWithPayload = { type: '' }) => {
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
        newP5000FromRinaMap[sedId] = p5000saved
      }
      return {
        ...state,
        newP5000FromRinaMap: newP5000FromRinaMap,
        sentP5000info: (action as ActionWithPayload).payload
      }
    }

    case types.P5000_SEND_FAILURE:
      return {
        ...state,
        sentP5000info: null
      }

    case types.P5000_GET_SUCCESS: {
      const newp5000FromRina = _.cloneDeep(state.p5000FromRinaMap)
      const payload = (action as ActionWithPayload).payload
      const sedid = (action as ActionWithPayload).context.id
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
      newp5000FromRina[sedid] = payload
      return {
        ...state,
        p5000FromRinaMap: newp5000FromRina
      }
    }

    case types.P5000_STORAGE_INIT: {
      const items: string | null = window.localStorage.getItem((action as ActionWithPayload).payload)
      let savedEntries: LocalStorageEntry<P5000SED>
      if (_.isString(items)) {
        savedEntries = JSON.parse(items)
      } else {
        savedEntries = {} as LocalStorageEntry<P5000SED>
      }
      return {
        ...state,
        p5000StorageKey: (action as ActionWithPayload).payload,
        p5000Storage: savedEntries
      }
    }

    case types.P5000_STORAGE_REMOVE: {
      const newP5000Storage = _.cloneDeep(state.p5000Storage)
      const caseId = (action as ActionWithPayload).payload.caseId
      const sedId = (action as ActionWithPayload).payload.sedId
      const entries: Array<LocalStorageValue<P5000SED>> = _.cloneDeep(newP5000Storage![caseId])
      const newEntries: Array<LocalStorageValue<P5000SED>> = _.filter(entries, n => n.id !== sedId)
      if (_.isEmpty(newEntries)) {
        delete newP5000Storage![caseId]
      } else {
        newP5000Storage![caseId] = newEntries
      }
      asyncLocalStorage.setItem(state.p5000StorageKey!, JSON.stringify(newP5000Storage))
      return {
        ...state,
        p5000Storage: newP5000Storage
      }
    }

    case types.P5000_STORAGE_SAVE: {
      const newSed: P5000SED = (action as ActionWithPayload).payload.newSed
      const caseId: string = (action as ActionWithPayload).payload.caseId
      const sedId: string = (action as ActionWithPayload).payload.sedId

      const newEntry: LocalStorageValue<P5000SED> = {
        id: sedId,
        date: new Date().getTime(),
        content: newSed
      }

      const newP5000Storage = _.cloneDeep(state.p5000Storage)
      if (Object.prototype.hasOwnProperty.call(newP5000Storage, caseId)) {
        let entries: Array<LocalStorageValue<P5000SED>> = _.cloneDeep(newP5000Storage![caseId])
        const index: number = _.findIndex(entries, e => e.id === sedId)
        if (index >= 0) {
          entries[index] = newEntry
        } else {
          entries = entries.concat(newEntry)
        }
        newP5000Storage![caseId] = entries
      } else {
        newP5000Storage![caseId] = [newEntry] as Array<LocalStorageValue<P5000SED>>
      }
      asyncLocalStorage.setItem(state.p5000StorageKey!, JSON.stringify(newP5000Storage))
      return {
        ...state,
        p5000Storage: newP5000Storage
      }
    }

    default:
      return state
  }
}

export default p5000Reducer
