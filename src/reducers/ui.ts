import * as types from 'constants/actionTypes'
import { AllowedLocaleString } from 'declarations/types'
import { ModalContent } from 'declarations/components'
import { ActionWithPayload } from 'js-fetch-api'
import { Action } from 'redux'
import i18n from '../i18n'

export interface UiState {
  language: AllowedLocaleString
  locale: AllowedLocaleString
  modal: ModalContent | undefined
  footerOpen: false
  highContrast: false
}

export const initialUiState: UiState = {
  language: i18n.language as AllowedLocaleString,
  locale: i18n.language as AllowedLocaleString,
  modal: undefined,
  footerOpen: false,
  highContrast: false
}

const uiReducer = (state: UiState = initialUiState, action: Action | ActionWithPayload) => {
  switch (action.type) {
    case types.UI_MODAL_SET:
      return {
        ...state,
        modal: (action as ActionWithPayload).payload
      }

    case types.UI_LANGUAGE_CHANGED:

      return {
        ...state,
        language: (action as ActionWithPayload).payload,
        locale: (action as ActionWithPayload).payload === 'nb' ? 'nb' : 'en'
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

    default:

      return state
  }
}

export default uiReducer
