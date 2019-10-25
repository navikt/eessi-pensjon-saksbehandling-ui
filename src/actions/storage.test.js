import { call } from 'eessi-pensjon-ui/dist/api'
import * as storageActions from 'actions/storage'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as storage from 'constants/storage'
const sprintf = require('sprintf-js').sprintf
jest.mock('eessi-pensjon-ui/dist/api', () => ({
  call: jest.fn()
}))

describe('actions/storage', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('openStorageModal()', () => {
    const options = { foo: 'bar' }
    const generatedResult = storageActions.openStorageModal(options)
    expect(generatedResult).toMatchObject({
      type: types.STORAGE_MODAL_OPEN,
      payload: options
    })
  })

  it('closeStorageModal()', () => {
    const generatedResult = storageActions.closeStorageModal()
    expect(generatedResult).toMatchObject({
      type: types.STORAGE_MODAL_CLOSE
    })
  })

  it('listStorageFiles() with no notification', () => {
    const mockParams = {
      userId: 'mockUser',
      namespace: storage.NAMESPACE_PINFO
    }
    const mockContext = { notification: false }
    storageActions.listStorageFiles(mockParams, mockContext)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.STORAGE_LIST_REQUEST,
        success: types.STORAGE_LIST_SUCCESS,
        failure: types.STORAGE_LIST_FAILURE
      },
      context: mockContext,
      method: 'GET',
      url: sprintf(urls.API_STORAGE_LIST_URL, mockParams)
    }))
  })

  it('listStorageFiles() with notification', () => {
    const mockParams = {
      userId: 'mockUser',
      namespace: storage.NAMESPACE_VARSLER
    }
    storageActions.listStorageFiles(mockParams)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.STORAGE_LIST_REQUEST,
        success: types.STORAGE_LIST_SUCCESS,
        failure: types.STORAGE_LIST_FAILURE
      },
      context: { notification: true },
      method: 'GET',
      url: sprintf(urls.API_STORAGE_LIST_URL, mockParams)
    }))
  })

  it('getStorageFile() with no notification', () => {
    const mockParams = {
      userId: 'userId',
      namespace: 'varsler',
      file: 'file'
    }
    storageActions.getStorageFile(mockParams, { notification: false })
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.STORAGE_GET_REQUEST,
        success: types.STORAGE_GET_SUCCESS,
        failure: types.STORAGE_GET_FAILURE
      },
      method: 'GET',
      context: { notification: false },
      url: sprintf(urls.API_STORAGE_GET_URL, mockParams)
    }))
  })

  it('getStorageFiles() with notification', () => {
    const mockParams = {
      userId: 'userId',
      namespace: 'namespace',
      file: 'file'
    }
    storageActions.getStorageFile(mockParams)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.STORAGE_GET_REQUEST,
        success: types.STORAGE_GET_SUCCESS,
        failure: types.STORAGE_GET_FAILURE
      },
      method: 'GET',
      context: { notification: true },
      url: sprintf(urls.API_STORAGE_GET_URL, mockParams)
    }))
  })

  it('postStorageFile() without notification', () => {
    const mockParams = {
      userId: 'userId',
      namespace: 'namespace',
      file: 'file'
    }
    const mockPayload = { foo: 'bar' }
    const mockContext = { notification: false }
    storageActions.postStorageFile(mockParams, mockPayload, mockContext)
    expect(call).toBeCalledWith({
      type: {
        request: types.STORAGE_POST_REQUEST,
        success: types.STORAGE_POST_SUCCESS,
        failure: types.STORAGE_POST_FAILURE
      },
      method: 'POST',
      payload: mockPayload,
      context: { notification: false },
      url: sprintf(urls.API_STORAGE_POST_URL, mockParams)
    })
  })

  it('postStorageFile() with notification', () => {
    const mockParams = {
      userId: 'userId',
      namespace: 'namespace',
      file: 'file'
    }
    const mockPayload = { foo: 'bar' }
    storageActions.postStorageFile(mockParams, mockPayload)
    expect(call).toBeCalledWith({
      type: {
        request: types.STORAGE_POST_REQUEST,
        success: types.STORAGE_POST_SUCCESS,
        failure: types.STORAGE_POST_FAILURE
      },
      method: 'POST',
      payload: mockPayload,
      context: { notification: true },
      url: sprintf(urls.API_STORAGE_POST_URL, mockParams)
    })
  })

  it('getAttachmentFromStorage()', () => {
    const mockParams = {
      userId: 'userId',
      namespace: 'namespace',
      file: 'attachmentFile'
    }
    storageActions.getAttachmentFromStorage(mockParams)
    expect(call).toBeCalledWith({
      type: {
        request: types.STORAGE_GET_ATTACHMENT_REQUEST,
        success: types.STORAGE_GET_ATTACHMENT_SUCCESS,
        failure: types.STORAGE_GET_ATTACHMENT_FAILURE
      },
      method: 'GET',
      url: sprintf(urls.API_STORAGE_GET_URL, mockParams)
    })
  })

  it('deleteStorageFile()', () => {
    const mockParams = {
      userId: 'userId',
      namespace: 'namespace',
      file: 'attachmentFile'
    }
    storageActions.deleteStorageFile(mockParams)
    expect(call).toBeCalledWith({
      type: {
        request: types.STORAGE_DELETE_REQUEST,
        success: types.STORAGE_DELETE_SUCCESS,
        failure: types.STORAGE_DELETE_FAILURE
      },
      method: 'DELETE',
      url: sprintf(urls.API_STORAGE_DELETE_URL, mockParams)
    })
  })

  it('deleteAllStorageFilesFromUser()', () => {
    const mockParams = {
      userId: 'userId',
      namespace: 'namespace'
    }
    storageActions.deleteAllStorageFilesFromUser(mockParams)
    expect(call).toBeCalledWith({
      type: {
        request: types.STORAGE_MULTIPLE_DELETE_REQUEST,
        success: types.STORAGE_MULTIPLE_DELETE_SUCCESS,
        failure: types.STORAGE_MULTIPLE_DELETE_FAILURE
      },
      method: 'DELETE',
      url: sprintf(urls.API_STORAGE_MULTIPLE_DELETE_URL, mockParams)
    })
  })

  it('setTargetFileToDelete()', () => {
    const mockPayload = { foo: 'bar' }
    const generatedResult = storageActions.setTargetFileToDelete(mockPayload)
    expect(generatedResult).toMatchObject({
      type: types.STORAGE_TARGET_FILE_TO_DELETE_SET,
      payload: mockPayload
    })
  })

  it('cancelTargetFileToDelete()', () => {
    const generatedResult = storageActions.cancelTargetFileToDelete()
    expect(generatedResult).toMatchObject({
      type: types.STORAGE_TARGET_FILE_TO_DELETE_CANCEL
    })
  })
})
