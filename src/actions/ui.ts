import { AllowedLocaleString } from 'declarations/types'
import { ModalContent } from 'declarations/components'
import i18n from 'i18n'
import * as types from 'constants/actionTypes'
import { ActionWithPayload } from 'js-fetch-api'
import { Action } from 'redux'

export const changeLanguage = (language: AllowedLocaleString): ActionWithPayload<AllowedLocaleString> => {
  i18n.changeLanguage(language)
  return {
    type: types.UI_LANGUAGE_CHANGED,
    payload: language
  }
}

export const openModal = (modal: ModalContent): ActionWithPayload<ModalContent> => ({
  type: types.UI_MODAL_SET,
  payload: modal
})

export const closeModal = (): ActionWithPayload<undefined> => ({
  type: types.UI_MODAL_SET,
  payload: undefined
})

export const toggleFooterOpen = (): Action => ({
  type: types.UI_FOOTER_TOGGLE_OPEN
})

export const toggleHighContrast = (): Action => ({
  type: types.UI_HIGHCONTRAST_TOGGLE
})
