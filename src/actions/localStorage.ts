import * as types from 'constants/actionTypes'
import { LocalStorageEntry, PSED } from 'declarations/app.d'
import { ActionWithPayload } from '@navikt/fetch'
import { Action } from 'redux'

export const loadEntries = (): Action => ({
  type: types.LOCALSTORAGE_ENTRIES_LOAD
})

export const removeAllEntries = (): Action => ({
  type: types.LOCALSTORAGE_ALL_REMOVE
})

export const removeEntry = (caseId: string, entry: LocalStorageEntry<PSED>) => ({
  type: types.LOCALSTORAGE_ENTRY_REMOVE,
  payload: {
    caseId,
    entry
  }
})

export const saveEntry = (caseId: string, entry: LocalStorageEntry<PSED>): ActionWithPayload<any> => ({
  type: types.LOCALSTORAGE_ENTRY_SAVE,
  payload: {
    caseId,
    entry
  }
})
