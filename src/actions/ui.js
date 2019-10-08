import i18n from 'i18n'
import * as types from 'constants/actionTypes'

export const changeLanguage = (language) => {
  i18n.changeLanguage(language)
  return {
    type: types.UI_LANGUAGE_CHANGED,
    payload: language
  }
}

export const openModal = (modal) => {
  return {
    type: types.UI_MODAL_SET,
    payload: modal
  }
}

export const closeModal = () => {
  return {
    type: types.UI_MODAL_SET,
    payload: undefined
  }
}

export const toggleFooterOpen = () => {
  return {
    type: types.UI_FOOTER_TOGGLE_OPEN
  }
}

export const toggleHighContrast = () => {
  return {
    type: types.UI_HIGHCONTRAST_TOGGLE
  }
}
