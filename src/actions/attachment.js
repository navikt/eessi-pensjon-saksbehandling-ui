import _ from 'lodash'
import * as types from '../constants/actionTypes'
import * as constants from '../constants/constants'
import * as storageActions from './storage'
import * as pinfoActions from './pinfo'
import * as utility from '../utils/attachmentUtility'

export function addFileToState (file) {
  return {
    type: types.ATTACHMENT_ADD_FILE_TO_STATE,
    payload: file
  }
}

export function removeFileFromState (fileKey) {
  return {
    type: types.ATTACHMENT_REMOVE_FILE_FROM_STATE,
    payload: fileKey
  }
}

export function removeFileArrayFromState (fileArray) {
  return {
    type: types.ATTACHMENT_REMOVE_FILE_ARRAY_FROM_STATE,
    payload: fileArray
  }
}

export function clearAttachmentState () {
  return {
    type: types.ATTACHMENT_CLEAR_STATE
  }
}

export function getAllStateFromStorage () {
  return function (dispatch) {
    dispatch({ type: types.ATTACHMENT_GET_ALL_STATE })
    return dispatch(getFileListFromStorage())
      .then(() => dispatch(getPinfoFileFromStorage()))
      .then(() => dispatch(getAttachmentFilesFromStorage()))
      .catch((error) => dispatch({ type: types.ATTACHMENT_GET_ALL_STATE_FAILURE, payload: error }))
  }
}

export function syncLocalStateWithStorage () {
  return function (dispatch) {
    dispatch({ type: types.ATTACHMENT_SYNCRONIZE_STATE })
    return dispatch(() => dispatch(getFileListFromStorage()))
      .then(() => dispatch(deleteUnusedAttachmentFilesFromStorage()))
      .then(() => dispatch(getAttachmentFilesFromStorage()))
      .then(() => dispatch(postAttachmentFilesToStorage()))
      .catch((error) => dispatch({ type: types.ATTACHMENT_SYNCRONIZE_STATE_FAILURE, payload: error }))
      .finally(() => dispatch(removeUnusedAttachmentFilesFromState()))
  }
}

function getFileListFromStorage () {
  return function (dispatch, getState) {
    dispatch({ type: types.ATTACHMENT_GET_STORAGE_LIST })
    const { app } = getState()
    return dispatch(storageActions.listStorageFiles(app.username, constants.PINFO))
  }
}

function getPinfoFileFromStorage () {
  return function (dispatch, getState) {
    dispatch({ type: types.ATTACHMENT_GET_PINFO_FILE })

    const { app, storage } = getState()
    if (storage.fileList && storage.fileList.includes(constants.PINFO_FILE)) {
      return dispatch(pinfoActions.getPinfoFromStorage({
        userId: app.username,
        namespace: constants.PINFO,
        file: constants.PINFO_FILE
      }))
    }
    return dispatch(pinfoActions.setReady())
  }
}

function removeUnusedAttachmentFilesFromState () {
  return function (dispatch, getState) {
    dispatch({ type: types.ATTACHMENT_DELETE_LOCAL_ATTACHMENTS })

    const { attachment, pinfo } = getState()
    const inUse = utility.getPeriodAttachmentMd5Signatures(pinfo.stayAbroad)
    const inMemory = utility.getAttachmentContentMd5Signatures(attachment)
    const orphansInMemory = _.difference(inMemory, inUse)

    dispatch(removeFileArrayFromState(orphansInMemory))
  }
}

function deleteUnusedAttachmentFilesFromStorage () {
  return function (dispatch, getState) {
    dispatch({ type: types.ATTACHMENT_DELETE_STORAGE_FILES })

    const { app, storage, pinfo } = getState()
    const inUse = utility.getPeriodAttachmentMd5Signatures(pinfo.stayAbroad)
    const fileList = utility.getMd5SignatureFromFileList(storage.fileList)

    const orphansInStorage = _.difference(fileList, inUse)

    return Promise.all(
      orphansInStorage.map(
        file => dispatch(
          storageActions.deleteStorageFile(
            app.username,
            constants.PINFO,
            file + '.json'
          )
        )
      )
    )
  }
}

function getAttachmentFilesFromStorage () {
  return function (dispatch, getState) {
    dispatch({ type: types.ATTACHMENT_GET_STORAGE_FILES })

    const { app, storage, attachment, pinfo } = getState()
    const inUse = utility.getPeriodAttachmentMd5Signatures(pinfo.stayAbroad)
    const inMemory = utility.getAttachmentContentMd5Signatures(attachment)
    const fileList = utility.getMd5SignatureFromFileList(storage.fileList)

    const filesNotLoaded = _.difference(inUse, inMemory)
    const loadableFiles = _.intersection(fileList, filesNotLoaded)

    return Promise.all(
      loadableFiles.map(
        file => dispatch(
          storageActions.getAttachmentFromStorage(
            {
              userId: app.username,
              namespace: constants.PINFO,
              file: file + '.json'
            }
          )
        )
      )
    )
  }
}

function postAttachmentFilesToStorage () {
  return function (dispatch, getState) {
    dispatch({ type: types.ATTACHMENT_POST_STORAGE_FILES })

    const { app, storage, attachment, pinfo } = getState()
    const inUse = utility.getPeriodAttachmentMd5Signatures(pinfo.stayAbroad)
    const inMemory = utility.getAttachmentContentMd5Signatures(attachment)
    const fileList = utility.getMd5SignatureFromFileList(storage.fileList)

    const localFiles = _.intersection(inUse, inMemory)
    const filesToBeUploaded = _.difference(localFiles, fileList)

    return Promise.all(
      filesToBeUploaded.map(
        file => dispatch(
          storageActions.postStorageFile(
            app.username,
            constants.PINFO,
            file + '.json',
            { [file]: attachment[file] }
          )
        )
      )
    )
  }
}
