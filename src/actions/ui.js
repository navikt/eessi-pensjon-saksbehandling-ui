import * as types from 'constants/actionTypes'
import i18n from 'i18n'

export function changeLanguage (language) {
  i18n.changeLanguage(language)

  return {
    type: types.UI_LANGUAGE_CHANGED,
    payload: language
  }
}

export function openModal (modal) {
  return {
    type: types.UI_MODAL_OPEN,
    payload: modal
  }
}

export function closeModal () {
  return {
    type: types.UI_MODAL_CLOSE
  }
}

export function toggleDrawerOpen () {
  return {
    type: types.UI_DRAWER_TOGGLE_OPEN
  }
}

export function toggleFooterOpen () {
  return {
    type: types.UI_FOOTER_TOGGLE_OPEN
  }
}

export function toggleHighContrast () {
  return {
    type: types.UI_HIGHCONTRAST_TOGGLE
  }
}

export function toggleDrawerEnable () {
  return {
    type: types.UI_DRAWER_TOGGLE_ENABLE
  }
}

export function changeDrawerWidth (newWidth) {
  return {
    type: types.UI_DRAWER_WIDTH_SET,
    payload: newWidth
  }
}
