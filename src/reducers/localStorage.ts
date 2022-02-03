import * as types from 'constants/actionTypes'
import { Entries, Entry, LocalStorageEntry, PSED } from 'declarations/app.d'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import { Action } from 'redux'
import { Sort } from '@navikt/tabell'

// these are used for: 1) reducer namespace, and 2) local storage key

export const storageKey = 'buc'

export interface LocalStorageState {
  entries: Entries
}

export const initialLocalStorageState: LocalStorageState = {
  entries: undefined
}

const localStorageReducer = (
  state: LocalStorageState = initialLocalStorageState,
  action: Action = { type: '' }
): LocalStorageState => {
  const caseId: string | undefined = (action as ActionWithPayload).payload?.caseId

  switch (action.type) {
    case types.LOCALSTORAGE_ENTRIES_LOAD: {
      const items: string | null = window.localStorage.getItem(storageKey)
      const entries : Entries = _.isString(items) ? JSON.parse(items) : null
      return {
        entries
      }
    }

    case types.LOCALSTORAGE_ENTRY_REMOVE: {
      const newEntries: Entries = _.cloneDeep(state.entries)
      const entry = ((action as ActionWithPayload).payload).entry
      if (_.isNil(caseId)) {
        throw new Error('Can\'t remove without a caseId')
      }
      if (_.isNil(newEntries)) {
        throw new Error('Can\'t remove from localStorage if it is empty')
      }
      const newEntry: Entry = _.cloneDeep(newEntries[caseId])
      if (_.isNil(entry)) {
        throw new Error('Can\'t find casdId for removal')
      }

      const index: number = _.findIndex(newEntry, (e) => e.sedId === entry.sedId)
      if (index >= 0) {
        newEntry!.splice(index, 1)
      }
      if (_.isEmpty(newEntry)) {
        delete newEntries[caseId]
      } else {
        newEntries[caseId] = newEntry
      }

      window.localStorage.setItem(
        storageKey,
        JSON.stringify(newEntries, null, 2))

      return {
        entries: newEntries
      }
    }

    case types.LOCALSTORAGE_ALL_REMOVE : {
      window.localStorage.setItem(storageKey, '{}')
      return {
        entries: undefined
      }
    }

    case types.LOCALSTORAGE_ENTRY_SAVE: {
      const entry: LocalStorageEntry<PSED> = (action as ActionWithPayload).payload.entry
      const sort: Sort | undefined = (action as ActionWithPayload).payload.sort

      if (_.isNil(caseId)) {
        throw new Error('Can\'t remove without a caseId')
      }

      let newEntries: Entries = _.cloneDeep(state.entries)
      if (_.isNil(newEntries)) {
        newEntries = {}
      }
      let newEntry = newEntries[caseId]
      if (_.isNil(newEntry)) {
        newEntry = []
      }

      const existsIndex: number = _.findIndex(newEntry, e => e.sedId === entry.sedId)
      if (existsIndex >= 0) {
        // Sum table triggers a saved storage, will not send sort, so let's use the one already saved
        if (_.isNil(sort)) {
          entry.sort = newEntry[existsIndex].sort
        }
        newEntry[existsIndex] = entry
      } else {
        newEntry = newEntry.concat(entry)
      }

      newEntries[caseId] = newEntry

      window.localStorage.setItem(
        storageKey,
        JSON.stringify(newEntries, null, 2))

      return {
        entries: newEntries
      }
    }

    default:
      return state
  }
}

export default localStorageReducer
