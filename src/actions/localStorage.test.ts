import * as localStorageActions from 'actions/localStorage'
import * as types from 'constants/actionTypes'
import { LocalStorageEntry } from 'declarations/app'
import { P5000SED } from 'declarations/p5000'
import mockSed from 'mocks/buc/sed_P5000_small1'
describe('actions/localStorage', () => {
  const entry: LocalStorageEntry<P5000SED> = {
    sedId: 'sedId',
    sedType: 'P5000',
    date: 1234567,
    content: mockSed as P5000SED
  }

  it('loadEntries()', () => {
    expect(localStorageActions.loadEntries())
      .toMatchObject({
        type: types.LOCALSTORAGE_ENTRIES_LOAD
      })
  })

  it('removeEntry()', () => {
    expect(localStorageActions.removeEntry('123', entry))
      .toMatchObject({
        type: types.LOCALSTORAGE_ENTRY_REMOVE,
        payload: { caseId: '123', entry }
      })
  })

  it('saveEntry()', () => {
    expect(localStorageActions.saveEntry('123', entry))
      .toMatchObject({
        type: types.LOCALSTORAGE_ENTRY_SAVE,
        payload: { caseId: '123', entry }
      })
  })

  it('removeAllEntries()', () => {
    expect(localStorageActions.removeAllEntries())
      .toMatchObject({
        type: types.LOCALSTORAGE_ALL_REMOVE
      })
  })
})
