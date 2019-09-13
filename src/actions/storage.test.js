import * as api from 'actions/api'
import * as storageActions from 'actions/storage'
import * as types from 'constants/actionTypes'

describe('actions/storage', () => {
  beforeAll(() => {
    api.call = jest.fn()
  })

  afterEach(() => {
    api.call.mockReset()
  })

  afterAll(() => {
    api.call.mockRestore()
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
    const mockUser = 'mockUser'
    const mockNamespace = 'mockNamespace'
    storageActions.listStorageFiles(mockUser, mockNamespace, {notification: false})
    expect(api.call).toBeCalledWith({
      type: {
        request: types.STORAGE_LIST_REQUEST,
        success: types.STORAGE_LIST_SUCCESS,
        failure: types.STORAGE_LIST_FAILURE
      },
      context: {notification: false},
      method: 'GET',
      url: 'http://localhost/frontend/api/storage/list/mockUser___mockNamespace'
    })
  })

  it('listStorageFiles() with notification', () => {
    const mockUser = 'mockUser'
    const mockNamespace = 'mockNamespace'
    storageActions.listStorageFiles(mockUser, mockNamespace)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.STORAGE_LIST_REQUEST,
        success: types.STORAGE_LIST_SUCCESS,
        failure: types.STORAGE_LIST_FAILURE
      },
      context: {notification:true},
      method: 'GET',
      url: 'http://localhost/frontend/api/storage/list/mockUser___mockNamespace'
    })
  })

  it('getStorageFile() with no notification', () => {
    const mockParams = {
      userId: 'userId',
      namespace: 'namespace',
      file: 'file'
    }
    storageActions.getStorageFile(mockParams, {notification: false})
    expect(api.call).toBeCalledWith({
      type: {
        request: types.STORAGE_GET_REQUEST,
        success: types.STORAGE_GET_SUCCESS,
        failure: types.STORAGE_GET_FAILURE
      },
      method: 'GET',
      context: {notification:false},
      url: 'http://localhost/frontend/api/storage/get/userId___namespace___file'
    })
  })

  it('getStorageFiles() with notification', () => {
    const mockParams = {
      userId: 'userId',
      namespace: 'namespace',
      file: 'file'
    }
    storageActions.getStorageFile(mockParams)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.STORAGE_GET_REQUEST,
        success: types.STORAGE_GET_SUCCESS,
        failure: types.STORAGE_GET_FAILURE
      },
      method: 'GET',
      context: {notification: true},
      url: 'http://localhost/frontend/api/storage/get/userId___namespace___file'
    })
  })

  it('postStorageFile()', () => {
    const userId = 'userId'
    const namespace = 'namespace'
    const file = 'file'
    const payload = { foo: 'bar' }
    storageActions.postStorageFile(userId, namespace, file, payload, {notification: false})
    expect(api.call).toBeCalledWith({
      type: {
        request: types.STORAGE_POST_REQUEST,
        success: types.STORAGE_POST_SUCCESS,
        failure: types.STORAGE_POST_FAILURE
      },
      method: 'POST',
      payload: payload,
      context: {notification: false},
      url: 'http://localhost/frontend/api/storage/userId___namespace___file'
    })
  })

  it('postStorageFile()', () => {
    const userId = 'userId'
    const namespace = 'namespace'
    const file = 'file'
    const payload = { foo: 'bar' }
    storageActions.postStorageFile(userId, namespace, file, payload)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.STORAGE_POST_REQUEST,
        success: types.STORAGE_POST_SUCCESS,
        failure: types.STORAGE_POST_FAILURE
      },
      method: 'POST',
      payload: payload,
      {notification: true},
      url: 'http://localhost/frontend/api/storage/userId___namespace___file'
    })
  })

  it('getAttachmentFromStorage()', () => {
    const mockParams = {
      userId: 'userId',
      namespace: 'namespace',
      file: 'attachmentFile'
    }
    storageActions.getAttachmentFromStorage(mockParams)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.STORAGE_GET_ATTACHMENT_REQUEST,
        success: types.STORAGE_GET_ATTACHMENT_SUCCESS,
        failure: types.STORAGE_GET_ATTACHMENT_FAILURE
      },
      method: 'GET',
      url: 'http://localhost/frontend/api/storage/get/userId___namespace___attachmentFile'
    })
  })

  it('deleteStorageFile()', () => {
    const userId = 'userId'

    const namespace = 'namespace'

    const file = 'file'

    storageActions.deleteStorageFile(userId, namespace, file)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.STORAGE_DELETE_REQUEST,
        success: types.STORAGE_DELETE_SUCCESS,
        failure: types.STORAGE_DELETE_FAILURE
      },
      method: 'DELETE',
      url: 'http://localhost/frontend/api/storage/userId___namespace___file'
    })
  })

  it('deleteAllStorageFilesFromUser()', () => {
    const userId = 'userId'

    const namespace = 'namespace'

    storageActions.deleteAllStorageFilesFromUser(userId, namespace)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.STORAGE_MULTIPLE_DELETE_REQUEST,
        success: types.STORAGE_MULTIPLE_DELETE_SUCCESS,
        failure: types.STORAGE_MULTIPLE_DELETE_FAILURE
      },
      method: 'DELETE',
      url: 'http://localhost/frontend/api/storage/multiple/userId___namespace'
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
