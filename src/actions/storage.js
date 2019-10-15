import * as api from 'actions/api'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as storage from 'constants/storage'
const sprintf = require('sprintf-js').sprintf

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

const mockListStorageFiles = (userId, namespace) => {
  if (namespace === storage.NAMESPACE_PINFO) {
    return [userId + '___' + namespace + '___' + storage.FILE_PINFO]
  }
  if (namespace === storage.NAMESPACE_VARSLER + '___123') {
    return [userId + '___' + namespace + '___1970-01-01Z00:00:00']
  }
  return []
}

export const listStorageFiles = ({ userId, namespace }, context) => {
  return api.call({
    url: sprintf(urls.API_STORAGE_LIST_URL, { userId: userId, namespace: namespace }),
    method: 'GET',
    context: context || { notification: true },
    expectedPayload: () => mockListStorageFiles(userId, namespace),
    type: {
      request: types.STORAGE_LIST_REQUEST,
      success: types.STORAGE_LIST_SUCCESS,
      failure: types.STORAGE_LIST_FAILURE
    }
  })
}

export const getStorageFile = ({ userId, namespace, file }, context) => {
  return api.call({
    url: sprintf(urls.API_STORAGE_GET_URL, { userId: userId, namespace: namespace, file: file }),
    method: 'GET',
    expectedPayload: () => {
      if (namespace === storage.NAMESPACE_VARSLER) {
        return {
          tittel: 'mockTittel',
          fulltnavn: 'mockFulltnavn',
          timestamp: '1970-01-01Z00:00:00'
        }
      }
    },
    context: context || { notification: true },
    type: {
      request: types.STORAGE_GET_REQUEST,
      success: types.STORAGE_GET_SUCCESS,
      failure: types.STORAGE_GET_FAILURE
    }
  })
}

export const getAttachmentFromStorage = ({ userId, namespace, file }) => {
  return api.call({
    url: sprintf(urls.API_STORAGE_GET_URL, { userId: userId, namespace: namespace, file: file }),
    method: 'GET',
    type: {
      request: types.STORAGE_GET_ATTACHMENT_REQUEST,
      success: types.STORAGE_GET_ATTACHMENT_SUCCESS,
      failure: types.STORAGE_GET_ATTACHMENT_FAILURE
    }
  })
}

export const postStorageFile = ({ userId, namespace, file }, payload, context) => {
  return api.call({
    url: sprintf(urls.API_STORAGE_POST_URL, { userId: userId, namespace: namespace, file: file }),
    method: 'POST',
    payload: payload,
    context: context || { notification: true },
    type: {
      request: types.STORAGE_POST_REQUEST,
      success: types.STORAGE_POST_SUCCESS,
      failure: types.STORAGE_POST_FAILURE
    }
  })
}

export const deleteStorageFile = ({ userId, namespace, file }) => {
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

export const deleteAllStorageFilesFromUser = ({ userId, namespace }) => {
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
