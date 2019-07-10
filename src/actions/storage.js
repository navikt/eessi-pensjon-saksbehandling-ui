import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as api from 'actions/api'
var sprintf = require('sprintf-js').sprintf

export const openStorageModal = (options) => {
  return {
    type: types.STORAGE_MODAL_OPEN,
    payload: options
  }
}

export const closeStorageModal = () => {
  return {
    type: types.STORAGE_MODAL_CLOSE
  }
}

export const listStorageFilesWithNoNotification = (userId, namespace) => {
  return api.call({
    url: sprintf(urls.API_STORAGE_LIST_URL, { userId: userId, namespace: namespace }),
    method: 'GET',
    type: {
      request: types.STORAGE_LIST_NO_NOTIF_REQUEST,
      success: types.STORAGE_LIST_NO_NOTIF_SUCCESS,
      failure: types.STORAGE_LIST_NO_NOTIF_FAILURE
    }
  })
}

export const listStorageFiles = (userId, namespace) => {
  return api.call({
    url: sprintf(urls.API_STORAGE_LIST_URL, { userId: userId, namespace: namespace }),
    method: 'GET',
    type: {
      request: types.STORAGE_LIST_REQUEST,
      success: types.STORAGE_LIST_SUCCESS,
      failure: types.STORAGE_LIST_FAILURE
    }
  })
}

export const getStorageFileWithNoNotification = (params) => {
  return api.call({
    url: sprintf(urls.API_STORAGE_GET_URL, { userId: params.userId, namespace: params.namespace, file: params.file }),
    method: 'GET',
    type: {
      request: types.STORAGE_GET_NO_NOTIF_REQUEST,
      success: types.STORAGE_GET_NO_NOTIF_SUCCESS,
      failure: types.STORAGE_GET_NO_NOTIF_FAILURE
    }
  })
}

export const getStorageFile = (params) => {
  return api.call({
    url: sprintf(urls.API_STORAGE_GET_URL, { userId: params.userId, namespace: params.namespace, file: params.file }),
    method: 'GET',
    type: {
      request: types.STORAGE_GET_REQUEST,
      success: types.STORAGE_GET_SUCCESS,
      failure: types.STORAGE_GET_FAILURE
    }
  })
}

export const postStorageFileWithNoNotification = (userId, namespace, file, payload) => {
  return api.call({
    url: sprintf(urls.API_STORAGE_POST_URL, { userId: userId, namespace: namespace, file: file }),
    method: 'POST',
    payload: payload,
    type: {
      request: types.STORAGE_POST_NO_NOTIF_REQUEST,
      success: types.STORAGE_POST_NO_NOTIF_SUCCESS,
      failure: types.STORAGE_POST_NO_NOTIF_FAILURE
    }
  })
}

export const getAttachmentFromStorage = (params) => {
  return api.call({
    url: sprintf(urls.API_STORAGE_GET_URL, { userId: params.userId, namespace: params.namespace, file: params.file }),
    method: 'GET',
    type: {
      request: types.STORAGE_GET_ATTACHMENT_REQUEST,
      success: types.STORAGE_GET_ATTACHMENT_SUCCESS,
      failure: types.STORAGE_GET_ATTACHMENT_FAILURE
    }
  })
}

export const postStorageFile = (userId, namespace, file, payload) => {
  return api.call({
    url: sprintf(urls.API_STORAGE_POST_URL, { userId: userId, namespace: namespace, file: file }),
    method: 'POST',
    payload: payload,
    type: {
      request: types.STORAGE_POST_REQUEST,
      success: types.STORAGE_POST_SUCCESS,
      failure: types.STORAGE_POST_FAILURE
    }
  })
}

export const deleteStorageFile = (userId, namespace, file) => {
  return api.call({
    url: sprintf(urls.API_STORAGE_DELETE_URL, { userId: userId, namespace: namespace, file: file }),
    method: 'DELETE',
    type: {
      request: types.STORAGE_DELETE_REQUEST,
      success: types.STORAGE_DELETE_SUCCESS,
      failure: types.STORAGE_DELETE_FAILURE
    }
  })
}

export const deleteAllStorageFilesFromUser = (userId, namespace) => {
  return api.call({
    url: sprintf(urls.API_STORAGE_MULTIPLE_DELETE_URL, { userId: userId, namespace: namespace }),
    method: 'DELETE',
    type: {
      request: types.STORAGE_MULTIPLE_DELETE_REQUEST,
      success: types.STORAGE_MULTIPLE_DELETE_SUCCESS,
      failure: types.STORAGE_MULTIPLE_DELETE_FAILURE
    }
  })
}

export const setTargetFileToDelete = (file) => {
  return {
    type: types.STORAGE_TARGET_FILE_TO_DELETE_SET,
    payload: file
  }
}

export const cancelTargetFileToDelete = () => {
  return {
    type: types.STORAGE_TARGET_FILE_TO_DELETE_CANCEL
  }
}
