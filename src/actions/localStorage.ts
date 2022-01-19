import * as types from 'constants/actionTypes'
import { P4000SED } from 'declarations/p4000.d'
import { P5000SED } from 'declarations/p5000.d'
import { LocalStorageEntry } from 'declarations/app.d'
import { ActionWithPayload } from 'js-fetch-api'
import { LocalStorageNamespaces } from 'reducers/localStorage'

export const loadEntries = (namespace: LocalStorageNamespaces): ActionWithPayload => ({
  type: types.LOCALSTORAGE_ENTRIES_LOAD,
  payload: {
    namespace
  }
})

export const resetCurrentEntry = (namespace: LocalStorageNamespaces): ActionWithPayload => ({
  type: types.LOCALSTORAGE_CURRENTENTRY_RESET,
  payload: {
    namespace
  }
})

export const setCurrentEntry = (namespace: LocalStorageNamespaces, entry: LocalStorageEntry<P4000SED | P5000SED>) : ActionWithPayload<{namespace: string, entry: LocalStorageEntry<P4000SED | P5000SED>}> => ({
  type: types.LOCALSTORAGE_CURRENTENTRY_SET,
  payload: {
    namespace,
    entry
  }
})

export const removeEntry = (namespace: LocalStorageNamespaces, entry: LocalStorageEntry<P4000SED | P5000SED>) => ({
  type: types.LOCALSTORAGE_ENTRY_REMOVE,
  payload: {
    namespace,
    entry
  }
})

export const saveEntry = (namespace: LocalStorageNamespaces, entry: LocalStorageEntry<P4000SED | P5000SED>): ActionWithPayload<any> => ({
  type: types.LOCALSTORAGE_ENTRY_SAVE,
  payload: {
    namespace,
    entry
  }
})

export const removeAllEntries = (namespace: LocalStorageNamespaces) => ({
  type: types.LOCALSTORAGE_ALL_REMOVE,
  payload: {
    namespace
  }
})
