import * as types from 'src/constants/actionTypes'
import { LocalStorageEntriesMap, LocalStorageEntry, PSED } from 'src/declarations/app.d'
import { ActionWithPayload } from '@navikt/fetch'
import _ from 'lodash'
import { AnyAction } from 'redux'

// these are used for: 1) reducer namespace, and 2) local storage key

const storageKey = 'buc'

export interface LocalStorageState {
  entries: LocalStorageEntriesMap
}

const initialLocalStorageState: LocalStorageState = {
  entries: undefined
}

const localStorageReducer = (
  state: LocalStorageState = initialLocalStorageState,
  action: AnyAction
): LocalStorageState => {
  const caseId: string | undefined = (action as ActionWithPayload).payload?.caseId

  switch (action.type) {
    case types.LOCALSTORAGE_ALLENTRIES_LOAD: {
      const items: string | null = window.localStorage.getItem(storageKey)
      const entries : LocalStorageEntriesMap = _.isString(items) ? JSON.parse(items) : null
      return {
        entries
      }
    }

    case types.LOCALSTORAGE_ALLENTRIES_REMOVE : {
      window.localStorage.setItem(storageKey, '{}')
      return {
        entries: undefined
      }
    }

    case types.LOCALSTORAGE_ENTRIES_SAVE: {
      const entries: Array<LocalStorageEntry<PSED>> = (action as ActionWithPayload).payload.entries

      if (_.isNil(caseId)) {
        throw new Error('Can\'t remove without a caseId')
      }

      let newEntriesMap: LocalStorageEntriesMap = _.cloneDeep(state.entries)
      if (_.isNil(newEntriesMap)) {
        newEntriesMap = {}
      }

      if (_.isUndefined(entries) || _.isEmpty(entries)) {
        delete newEntriesMap[caseId]
      } else {
        newEntriesMap[caseId] = entries
      }

      window.localStorage.setItem(
        storageKey,
        JSON.stringify(newEntriesMap, null, 2))

      return {
        entries: newEntriesMap
      }
    }

    default:
      return state
  }
}

export default localStorageReducer
