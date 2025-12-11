import * as types from 'src/constants/actionTypes'
import { WidthSize } from 'src/declarations/app'
import { AllowedLocaleString } from 'src/declarations/app.d'
import { ModalContent } from 'src/declarations/components'
import { ActionWithPayload } from '@navikt/fetch'
import { AnyAction } from 'redux'
import i18n from '../i18n'

export interface UiState {
  language: AllowedLocaleString
  locale: AllowedLocaleString
  modal: ModalContent | undefined
  footerOpen: boolean
  size: WidthSize | undefined
}

export const initialUiState: UiState = {
  language: i18n.language as AllowedLocaleString,
  locale: i18n.language as AllowedLocaleString,
  modal: undefined,
  footerOpen: false,
  size: undefined
}

const uiReducer = (state: UiState = initialUiState, action: AnyAction) => {
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
        locale: ((action as ActionWithPayload).payload === 'nb' ? 'nb' : 'en') as AllowedLocaleString
      }

    case types.UI_FOOTER_TOGGLE_OPEN :

      return {
        ...state,
        footerOpen: !state.footerOpen
      }

    default:

      return state
  }
}

export default uiReducer
