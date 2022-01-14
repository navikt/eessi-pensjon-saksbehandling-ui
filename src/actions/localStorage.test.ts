import * as localStorageActions from 'actions/localStorage'
import * as types from 'constants/actionTypes'
import { LocalStorageEntry } from 'declarations/app'
import { P5000SED } from 'declarations/p5000'
import mockSed from 'mocks/buc/sed_P5000_small1'
import { LocalStorageNamespaces } from 'reducers/localStorage'
describe('actions/localStorage', () => {
  const namespace: LocalStorageNamespaces = 'P5000'

  const entry: LocalStorageEntry<P5000SED> = {
    sedId: 'sedId',
    caseId: 'caseId',
    date: 1234567,
    content: mockSed as P5000SED
  }

  it('loadEntries()', () => {
    expect(localStorageActions.loadEntries(namespace))
      .toMatchObject({
        type: types.LOCALSTORAGE_ENTRIES_LOAD,
        payload: { namespace }
      })
  })

  it('resetCurrentEntry()', () => {
    expect(localStorageActions.resetCurrentEntry(namespace))
      .toMatchObject({
        type: types.LOCALSTORAGE_CURRENTENTRY_RESET
      })
  })

  it('setCurrentEntry()', () => {
    expect(localStorageActions.setCurrentEntry(namespace, entry))
      .toMatchObject({
        type: types.LOCALSTORAGE_CURRENTENTRY_SET,
        payload: { namespace, entry }
      })
  })

  it('removeEntry()', () => {
    expect(localStorageActions.removeEntry(namespace, entry))
      .toMatchObject({
        type: types.LOCALSTORAGE_ENTRY_REMOVE,
        payload: { namespace, entry }
      })
  })

  it('saveEntry()', () => {
    expect(localStorageActions.saveEntry(namespace, entry))
      .toMatchObject({
        type: types.LOCALSTORAGE_ENTRY_SAVE,
        payload: { namespace, entry }
      })
  })

  it('removeAllEntries()', () => {
    expect(localStorageActions.removeAllEntries(namespace))
      .toMatchObject({
        type: types.LOCALSTORAGE_ALL_REMOVE,
        payload: { namespace }
      })
  })
})
