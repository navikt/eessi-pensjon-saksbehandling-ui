import * as types from 'constants/actionTypes'
import i18n from 'i18n'

export const changeLanguage = (language) => {
  i18n.changeLanguage(language)
  return {
    type: types.UI_LANGUAGE_CHANGED,
    payload: language
  }
}

export const openModal = (modal) => {
  return {
    type: types.UI_MODAL_OPEN,
    payload: modal
  }
}

export const closeModal = () => {
  return {
    type: types.UI_MODAL_CLOSE
  }
}

export const toggleDrawerOpen = () => {
  return {
    type: types.UI_DRAWER_TOGGLE_OPEN
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

export const toggleDrawerEnable = () => {
  return {
    type: types.UI_DRAWER_TOGGLE_ENABLE
  }
}

export const changeDrawerWidth = (newWidth) => {
  return {
    type: types.UI_DRAWER_WIDTH_SET,
    payload: newWidth
  }
}
