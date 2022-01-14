import * as types from 'constants/actionTypes'
import { P4000SED } from 'declarations/p4000.d'
import { P5000SED } from 'declarations/p5000.d'
import { LocalStorageEntry } from 'declarations/app.d'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import { Action } from 'redux'
import { Sort } from 'tabell'

// these are used for: 1) reducer namespace, and 2) local storage key
export type LocalStorageNamespaces = 'P4000' | 'P5000'

export interface LocalStorageState {
  P4000: {
    entries: Array<LocalStorageEntry<P4000SED>> | null | undefined
    // currentEntry !== undefined serves only the purpose of telling SEDEdit that the
    // current replySed came from a localstorage load, and therefore decides if the saving
    // button will be labeled as Update or Save
    currentEntry: LocalStorageEntry<P4000SED> | undefined
  }
  P5000: {
    entries: Array<LocalStorageEntry<P5000SED>> | null | undefined
    currentEntry: LocalStorageEntry<P5000SED> | undefined
  }
}

export const initialLocalStorageState: LocalStorageState = {
  P4000: {
    entries: undefined,
    currentEntry: undefined
  },
  P5000: {
    entries: undefined,
    currentEntry: undefined
  }
}

const localStorageReducer = (
  state: LocalStorageState = initialLocalStorageState,
  action: Action = { type: '' }
): LocalStorageState => {
  const namespace: LocalStorageNamespaces | undefined = (action as ActionWithPayload).payload?.namespace

  if (namespace) {
    switch (action.type) {
      case types.LOCALSTORAGE_ENTRIES_LOAD: {
        const items: string | null = window.localStorage.getItem((action as ActionWithPayload).payload.namespace)
        let entries: Array<LocalStorageEntry<P4000SED | P5000SED>> | null | undefined
        if (_.isString(items)) {
          entries = JSON.parse(items)
        } else {
          entries = null
        }
        return {
          ...state,
          [namespace]: {
            currentEntry: state[namespace].currentEntry,
            entries: entries
          }
        }
      }

      case types.LOCALSTORAGE_ENTRY_REMOVE: {
        const newEntries: Array<LocalStorageEntry<P4000SED | P5000SED>> | null | undefined = _.cloneDeep(state[namespace].entries)
        const index: number = _.findIndex(newEntries, (entry) =>
          entry.caseId === ((action as ActionWithPayload).payload).entry.caseId &&
          entry.sedId === ((action as ActionWithPayload).payload).entry.sedId
        )
        if (index >= 0) {
          if (!_.isNil(newEntries)) {
            newEntries.splice(index, 1)
            window.localStorage.setItem(
              (action as ActionWithPayload).payload.namespace,
              JSON.stringify(newEntries, null, 2))
          }
        }
        return {
          ...state,
          [namespace]: {
            ...state[namespace],
            entries: newEntries
          }
        }
      }

      case types.LOCALSTORAGE_ALL_REMOVE : {
        window.localStorage.setItem((action as ActionWithPayload).payload.namespace, '[]')
        return {
          ...state,
          [namespace]: {
            entries: undefined,
            currentEntry: undefined
          }
        }
      }

      case types.LOCALSTORAGE_ENTRY_SAVE: {
        let newEntries: Array<LocalStorageEntry<P4000SED | P5000SED>> | null | undefined = _.cloneDeep(state[namespace].entries)
        const newEntry: LocalStorageEntry<P4000SED | P5000SED> = (action as ActionWithPayload).payload.entry
        const sort: Sort | undefined = (action as ActionWithPayload).payload.sort

        if (_.isNil(newEntries)) {
          newEntries = []
        }

        const existsIndex: number = _.findIndex(newEntries, _e => _e.caseId === newEntry.caseId && _e.sedId === newEntry.sedId)
        if (existsIndex >= 0) {

          // Sum table triggers a saved storage, will not send sort, so let's use the one already saved
          if (_.isNil(sort)) {
            newEntry.sort = newEntries[existsIndex].sort
          }

          newEntries[existsIndex] = (action as ActionWithPayload).payload.entry
        } else {
          newEntries = newEntries.concat(newEntry)
        }

        window.localStorage.setItem(
          (action as ActionWithPayload).payload.namespace,
          JSON.stringify(newEntries, null, 2))

        return {
          ...state,
          [namespace]: {
            ...(state[namespace]),
            entries: newEntries
          }
        }
      }

      case types.LOCALSTORAGE_CURRENTENTRY_SET: {
        return {
          ...state,
          [namespace]: {
            ...(state[namespace]),
            currentEntry: (action as ActionWithPayload).payload.entry
          }
        }
      }

      case types.LOCALSTORAGE_CURRENTENTRY_RESET: {
        return {
          ...state,
          [namespace]: {
            ...(state[namespace]),
            currentEntry: undefined
          }
        }
      }

      default:
        return state
    }
  }
  return state
}

export default localStorageReducer
