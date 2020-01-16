import * as api from 'eessi-pensjon-ui/dist/api'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as storage from 'constants/storage'
import { Action, ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'
import { Varsler } from 'widgets/Varsler/VarslerPanel'
const sprintf = require('sprintf-js').sprintf

interface StorageParams {
  userId: string;
  namespace: string;
  file?: string;
}

export const openStorageModal = (options: any): ActionWithPayload<any> => {
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

const mockListStorageFiles = /* istanbul ignore next */ (userId: string, namespace: string): Array<string> => {
  if (namespace === storage.NAMESPACE_PINFO) {
    return [userId + '___' + namespace + '___' + storage.FILE_PINFO]
  }
  if (namespace === storage.NAMESPACE_VARSLER + '___123') {
    return [
      userId + '___' + namespace + '___2019-02-02Z00:00:00',
      userId + '___' + namespace + '___2019-02-27Z00:00:00',
      userId + '___' + namespace + '___2019-03-10Z00:00:00',
      userId + '___' + namespace + '___2019-03-22Z00:00:00',
      userId + '___' + namespace + '___2019-04-01Z00:00:00',
      userId + '___' + namespace + '___2019-06-15Z00:00:00'
    ]
  }
  return []
}

export const listStorageFiles = ({ userId, namespace }: StorageParams, context: any | undefined): Function => {
  return api.call({
    url: sprintf(urls.API_STORAGE_LIST_URL, { userId: userId, namespace: namespace }),
    method: 'GET',
    context: context || { notification: true },
    expectedPayload: /* istanbul ignore next */ () => mockListStorageFiles(userId, namespace),
    type: {
      request: types.STORAGE_LIST_REQUEST,
      success: types.STORAGE_LIST_SUCCESS,
      failure: types.STORAGE_LIST_FAILURE
    }
  })
}

export const getStorageFile = ({ userId, namespace, file }: StorageParams, context: any | undefined): Function => {
  return api.call({
    url: sprintf(urls.API_STORAGE_GET_URL, { userId: userId, namespace: namespace, file: file }),
    method: 'GET',
    expectedPayload: /* istanbul ignore next */ (): Varsler | undefined => {
      if (namespace === storage.NAMESPACE_VARSLER) {
        const names = ['Ola Nordmenn', 'Kari Olsen', 'Bjørn Knutsen', 'Are Petersen', 'Harald Eide', 'Ragnhild Dahl']
        return {
          tittel: 'E207',
          fulltnavn: names[Math.floor(Math.random() * names.length)],
          timestamp: file ? file.replace('123___', '') : '-'
        }
      }
      return undefined
    },
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

export const postStorageFile = ({ userId, namespace, file }: StorageParams, payload: any, context: any | undefined): Function => {
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

export const setTargetFileToDelete = (file: any): ActionWithPayload<any> => {
  return {
    type: types.STORAGE_TARGET_FILE_TO_DELETE_SET,
    payload: file
  }
}

export const cancelTargetFileToDelete = (): Action => {
  return {
    type: types.STORAGE_TARGET_FILE_TO_DELETE_CANCEL
  }
}
