import * as types from '../constants/actionTypes'
import i18n from '../i18n'

export const initialUiState = {
  language: i18n.language,
  locale: i18n.locale,
  modalOpen: false,
  modalBucketOpen: false,
  footerOpen: false,
  highContrast: false
}

const uiReducer = (state = initialUiState, action = {}) => {
  switch (action.type) {
    case types.UI_MODAL_OPEN:

      return Object.assign({}, state, {
        modalOpen: true,
        modal: action.payload
      })

    case types.UI_MODAL_CLOSE:

      return Object.assign({}, state, {
        modalOpen: false,
        modal: undefined
      })

    case types.UI_LANGUAGE_CHANGED:

      return Object.assign({}, state, {
        language: action.payload,
        locale: action.payload === 'nb' ? 'nb' : 'en'
      })

    case types.UI_FOOTER_TOGGLE_OPEN :

      return Object.assign({}, state, {
        footerOpen: !state.footerOpen
      })

    case types.UI_HIGHCONTRAST_TOGGLE :

      return Object.assign({}, state, {
        highContrast: !state.highContrast
      })

    default:

      return state
  }
}

export default uiReducer
