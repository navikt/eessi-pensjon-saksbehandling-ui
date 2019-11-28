import i18n from 'i18n'
import * as types from 'constants/actionTypes'
import { Action, JustTypeAction } from 'actions/actions' // eslint-disable-line

export const changeLanguage = (language: string): Action<string> => {
  // @ts-ignore
  i18n.changeLanguage(language)
  return {
    type: types.UI_LANGUAGE_CHANGED,
    payload: language
  }
}

export const openModal = (modal: any): Action<any> => {
  return {
    type: types.UI_MODAL_SET,
    payload: modal
  }
}

export const closeModal = (): Action<undefined> => {
  return {
    type: types.UI_MODAL_SET,
    payload: undefined
  }
}

export const toggleFooterOpen = (): JustTypeAction => {
  return {
    type: types.UI_FOOTER_TOGGLE_OPEN
  }
}

export const toggleHighContrast = (): JustTypeAction => {
  return {
    type: types.UI_HIGHCONTRAST_TOGGLE
  }
}

export const toggleSnow = (): JustTypeAction => {
  return {
    type: types.UI_SNOW_TOGGLE
  }
}
