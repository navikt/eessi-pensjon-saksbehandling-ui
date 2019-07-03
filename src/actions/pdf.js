import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as api from 'actions/api'

export function selectPDF (files) {
  return {
    type: types.PDF_SELECTED,
    payload: files
  }
}

export function loadingFilesStart () {
  return {
    type: types.PDF_LOADING_FILES_STARTED
  }
}

export function loadingFilesEnd () {
  return {
    type: types.PDF_LOADING_FILES_FINISHED
  }
}

export function clearPDF () {
  return {
    type: types.PDF_CLEAR
  }
}

export function setRecipe (recipe) {
  return {
    type: types.PDF_SET_RECIPE,
    payload: recipe
  }
}

export function setActiveDnDTarget (target) {
  return {
    type: types.PDF_SET_DND_TARGET,
    payload: target
  }
}

export function setPdfSize (size) {
  return {
    type: types.PDF_SET_PAGE_SIZE,
    payload: size
  }
}

export function setWatermark (payload) {
  return {
    type: types.PDF_WATERMARK_SET,
    payload: payload
  }
}

export function setSeparator (payload) {
  return {
    type: types.PDF_SEPARATOR_SET,
    payload: payload
  }
}

export function generatePDF (payload) {
  return api.call({
    url: urls.PDF_GENERATE_URL,
    method: 'POST',
    payload: payload,
    type: {
      request: types.PDF_GENERATE_REQUEST,
      success: types.PDF_GENERATE_SUCCESS,
      failure: types.PDF_GENERATE_FAILURE
    }
  })
}
