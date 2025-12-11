import uiReducer, { initialUiState } from './ui'
import * as types from 'src/constants/actionTypes'

describe('reducers/ui', () => {
  it('UI_MODAL_SET', () => {
    expect(
      uiReducer(initialUiState, {
        type: types.UI_MODAL_SET,
        payload: 'something'
      })
    ).toEqual({
      ...initialUiState,
      modal: 'something'
    })
  })

  it('UI_LANGUAGE_CHANGED', () => {
    expect(
      uiReducer(initialUiState, {
        type: types.UI_LANGUAGE_CHANGED,
        payload: 'something'
      })
    ).toEqual({
      ...initialUiState,
      language: 'something',
      locale: 'en'
    })
  })

  it('UI_FOOTER_TOGGLE_OPEN', () => {
    expect(
      uiReducer(initialUiState, {
        type: types.UI_FOOTER_TOGGLE_OPEN
      })
    ).toEqual({
      ...initialUiState,
      footerOpen: true
    })
  })

  it('UNKNOWN_ACTION', () => {
    expect(
      uiReducer(initialUiState, {
        type: 'UNKNOWN_ACTION'
      })
    ).toEqual(initialUiState)
  })
})
