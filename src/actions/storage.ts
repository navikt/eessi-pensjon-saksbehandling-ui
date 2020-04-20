import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as api from 'eessi-pensjon-ui/dist/api'
import { ModalContent } from 'eessi-pensjon-ui/dist/declarations/components'
import { ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'
import mockGetStorageFile from 'mocks/storage/getStorageFile'
import mockListStorageFiles from 'mocks/storage/listStorageFiles'
import { Action } from 'redux'

const sprintf = require('sprintf-js').sprintf

interface StorageParams {
  userId: string;
  namespace: string;
  file?: string;
}

export const openStorageModal = (modal: ModalContent): ActionWithPayload<ModalContent> => ({
  type: types.STORAGE_MODAL_OPEN,
  payload: modal
})

export const closeStorageModal = (): Action => ({
  type: types.STORAGE_MODAL_CLOSE
})

export const listStorageFiles = ({ userId, namespace }: StorageParams, context?: any): Function => {
  return api.call({
    url: sprintf(urls.API_STORAGE_LIST_URL, { userId: userId, namespace: namespace }),
    method: 'GET',
    context: context || { notification: true },
    expectedPayload: mockListStorageFiles(userId, namespace),
    type: {
      request: types.STORAGE_LIST_REQUEST,
      success: types.STORAGE_LIST_SUCCESS,
      failure: types.STORAGE_LIST_FAILURE
    }
  })
}

export const getStorageFile = ({ userId, namespace, file }: StorageParams, context?: any): Function => {
  return api.call({
    url: sprintf(urls.API_STORAGE_GET_URL, { userId: userId, namespace: namespace, file: file }),
    method: 'GET',
    expectedPayload: mockGetStorageFile(namespace, file),
    context: context || { notification: true },
    type: {
      request: types.STORAGE_GET_REQUEST,
      success: types.STORAGE_GET_SUCCESS,
      failure: types.STORAGE_GET_FAILURE
    }
  })
}

export const getAttachmentFromStorage = ({ userId, namespace, file }: StorageParams): Function => {
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

export const postStorageFile = ({ userId, namespace, file }: StorageParams, payload: any, context?: any): Function => {
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

export const deleteStorageFile = ({ userId, namespace, file }: StorageParams): Function => {
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

export const deleteAllStorageFilesFromUser = ({ userId, namespace }: StorageParams): Function => {
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

export const setTargetFileToDelete = (file: any): ActionWithPayload<any> => ({
  type: types.STORAGE_TARGET_FILE_TO_DELETE_SET,
  payload: file
})

export const cancelTargetFileToDelete = (): Action => ({
  type: types.STORAGE_TARGET_FILE_TO_DELETE_CANCEL
})
