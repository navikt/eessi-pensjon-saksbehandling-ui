import { WidthSize } from 'declarations/app'
import { AllowedLocaleString } from 'declarations/types'
import { ModalContent } from 'declarations/components'
import i18n from 'i18n'
import * as types from 'constants/actionTypes'
import { ActionWithPayload } from 'js-fetch-api'
import { Action, ActionCreator } from 'redux'

export const changeLanguage: ActionCreator<ActionWithPayload<AllowedLocaleString>> = (
  language: AllowedLocaleString
): ActionWithPayload<AllowedLocaleString> => {
  i18n.changeLanguage(language)
  return {
    type: types.UI_LANGUAGE_CHANGED,
    payload: language
  }
}

export const closeModal: ActionCreator<ActionWithPayload<undefined>> = (
): ActionWithPayload<undefined> => ({
  type: types.UI_MODAL_SET,
  payload: undefined
})

export const openModal: ActionCreator<ActionWithPayload<ModalContent>> = (
  modal: ModalContent
): ActionWithPayload<ModalContent> => ({
  type: types.UI_MODAL_SET,
  payload: modal
})

export const setWidthSize: ActionCreator<ActionWithPayload<WidthSize>> = (
  size: WidthSize
): ActionWithPayload<WidthSize> => ({
  type: types.UI_WIDTH_SET,
  payload: size
})


export const toggleFooterOpen: ActionCreator<Action> = (): Action => ({
  type: types.UI_FOOTER_TOGGLE_OPEN
})

export const toggleHighContrast: ActionCreator<Action> = (): Action => ({
  type: types.UI_HIGHCONTRAST_TOGGLE
})
