import i18n from 'i18n'
import * as types from 'constants/actionTypes'
import { Action, ActionWithPayload } from 'types.d'

export const changeLanguage = (language: string): ActionWithPayload<string> => {
  // @ts-ignore
  i18n.changeLanguage(language)
  return {
    type: types.UI_LANGUAGE_CHANGED,
    payload: language
  }
}

export const openModal = (modal: any): ActionWithPayload<any> => {
  return {
    type: types.UI_MODAL_SET,
    payload: modal
  }
}

export const closeModal = (): ActionWithPayload<undefined> => {
  return {
    type: types.UI_MODAL_SET,
    payload: undefined
  }
}

export const toggleFooterOpen = (): Action => {
  return {
    type: types.UI_FOOTER_TOGGLE_OPEN
  }
}

export const toggleHighContrast = (): Action => {
  return {
    type: types.UI_HIGHCONTRAST_TOGGLE
  }
}

export const toggleSnow = (): Action => {
  return {
    type: types.UI_SNOW_TOGGLE
  }
}
