import { AllowedLocaleString } from 'src/declarations/app.d'
import { ModalContent } from 'src/declarations/components.d'
import i18n from 'src/i18n'
import * as types from 'src/constants/actionTypes'
import { ActionWithPayload } from '@navikt/fetch'
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

export const toggleFooterOpen: ActionCreator<Action> = (): Action => ({
  type: types.UI_FOOTER_TOGGLE_OPEN
})
