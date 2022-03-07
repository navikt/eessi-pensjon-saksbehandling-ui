import * as localStorageActions from 'actions/localStorage'
import * as types from 'constants/actionTypes'
import { LocalStorageEntry } from 'declarations/app'
import { P5000SED } from 'declarations/p5000'
import mockSed from 'mocks/buc/sed_P5000_small1'
describe('actions/localStorage', () => {
  const entries: Array<LocalStorageEntry<P5000SED>> = [{
    sedId: 'sedId',
    sedType: 'P5000',
    date: 1234567,
    content: mockSed as P5000SED
  }]

  it('loadAllEntries()', () => {
    expect(localStorageActions.loadAllEntries())
      .toMatchObject({
        type: types.LOCALSTORAGE_ALLENTRIES_LOAD
      })
  })

  it('saveEntries()', () => {
    expect(localStorageActions.saveEntries('123', entries))
      .toMatchObject({
        type: types.LOCALSTORAGE_ENTRIES_SAVE,
        payload: { caseId: '123', entries }
      })
  })

  it('removeAllEntries()', () => {
    expect(localStorageActions.removeAllEntries())
      .toMatchObject({
        type: types.LOCALSTORAGE_ALLENTRIES_REMOVE
      })
  })
})
