import uiReducer, { initialUiState } from './ui.js'
import * as types from 'constants/actionTypes'

describe('reducers/ui', () => {
  it('UI_MODAL_OPEN', () => {
    expect(
      uiReducer(initialUiState, {
        type: types.UI_MODAL_OPEN,
        payload: 'something'
      })
    ).toEqual({
      ...initialUiState,
      modalOpen: true,
      modal: 'something'
    })
  })

  it('UI_MODAL_CLOSE', () => {
    expect(
      uiReducer({
        ...initialUiState,
        modalOpen: true
      }, {
        type: types.UI_MODAL_CLOSE
      })
    ).toEqual(initialUiState)
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

  it('UI_HIGHCONTRAST_TOGGLE', () => {
    expect(
      uiReducer(initialUiState, {
        type: types.UI_HIGHCONTRAST_TOGGLE
      })
    ).toEqual({
      ...initialUiState,
      highContrast: true
    })
  })
})
