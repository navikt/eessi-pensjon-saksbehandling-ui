import i18n from 'i18n'
import * as types from 'constants/actionTypes'
import { Action, ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'

export const changeLanguage = (language: string): ActionWithPayload<string> => {
  i18n.changeLanguage(language)
  return {
    type: types.UI_LANGUAGE_CHANGED,
    payload: language
  }
}

export const openModal = (modal: any): ActionWithPayload<any> => ({
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

export const toggleSnow = (): Action => ({
  type: types.UI_SNOW_TOGGLE
})
