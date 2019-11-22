import * as types from 'constants/actionTypes'
import i18n from '../i18n'

export const initialUiState = {
  language: i18n.language,
  locale: i18n.locale,
  modal: undefined,
  footerOpen: false,
  highContrast: false,
  snow: true
}

const uiReducer = (state = initialUiState, action = {}) => {
  switch (action.type) {
    case types.UI_MODAL_SET:
      return {
        ...state,
        modal: action.payload
      }

    case types.UI_LANGUAGE_CHANGED:

      return {
        ...state,
        language: action.payload,
        locale: action.payload === 'nb' ? 'nb' : 'en'
      }

    case types.UI_FOOTER_TOGGLE_OPEN :

      return {
        ...state,
        footerOpen: !state.footerOpen
      }

    case types.UI_HIGHCONTRAST_TOGGLE :

      return {
        ...state,
        highContrast: !state.highContrast
      }

    case types.UI_SNOW_TOGGLE :

      return {
        ...state,
        snow: !state.snow
      }

    default:

      return state
  }
}

export default uiReducer
