import * as types from 'constants/actionTypes'
import { LocalStorageEntry, PSED } from 'declarations/app.d'
import { ActionWithPayload } from '@navikt/fetch'
import { Action } from 'redux'

export const loadAllEntries = (): Action => ({
  type: types.LOCALSTORAGE_ALLENTRIES_LOAD
})

export const removeAllEntries = (): Action => ({
  type: types.LOCALSTORAGE_ALLENTRIES_REMOVE
})

export const saveEntries = (caseId: string, entries: Array<LocalStorageEntry<PSED>> | undefined): ActionWithPayload<any> => ({
  type: types.LOCALSTORAGE_ENTRIES_SAVE,
  payload: {
    caseId,
    entries
  }
})
