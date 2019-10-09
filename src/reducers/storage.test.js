import storageReducer, { initialStorageState } from './storage.js'
import * as types from 'constants/actionTypes'

describe('reducers/storage', () => {
  it('STORAGE_LIST_SUCCESS', () => {
    expect(
      storageReducer(initialStorageState, {
        type: types.STORAGE_LIST_SUCCESS,
        payload: ['123___namespace___file1', '123___othernamespace___file2']
      })
    ).toEqual({
      ...initialStorageState,
      fileList: ['file1', 'file2']
    })
  })

  it('STORAGE_LIST_FAILURE', () => {
    expect(
      storageReducer({
        ...initialStorageState,
        fileList: 'something'
      }, {
        type: types.STORAGE_LIST_FAILURE
      })
    ).toEqual({
      ...initialStorageState,
      fileList: []
    })
  })

  it('STORAGE_GET_SUCCESS', () => {
    expect(
      storageReducer(
        initialStorageState, {
          type: types.STORAGE_GET_SUCCESS,
          payload: 'something'
        })
    ).toEqual({
      ...initialStorageState,
      file: 'something'
    })
  })

  it('STORAGE_POST_SUCCESS', () => {
    expect(
      storageReducer({
        ...initialStorageState,
        fileList: 'something'
      }, {
        type: types.STORAGE_POST_SUCCESS
      })
    ).toEqual(initialStorageState)
  })

  it('STORAGE_TARGET_FILE_TO_DELETE_SET', () => {
    expect(
      storageReducer(initialStorageState, {
        type: types.STORAGE_TARGET_FILE_TO_DELETE_SET,
        payload: 'something'
      })
    ).toEqual({
      ...initialStorageState,
      fileToDelete: 'something'
    })
  })

  it('STORAGE_TARGET_FILE_TO_DELETE_CANCEL', () => {
    expect(
      storageReducer({
        ...initialStorageState,
        fileToDelete: 'something'
      }, {
        type: types.STORAGE_TARGET_FILE_TO_DELETE_CANCEL
      })
    ).toEqual(initialStorageState)
  })

  it('STORAGE_DELETE_SUCCESS', () => {
    expect(
      storageReducer({
        ...initialStorageState,
        fileList: [{ a: 1 }, { b: 2 }, { c: 3 }],
        fileToDelete: { b: 2 }
      }, {
        type: types.STORAGE_DELETE_SUCCESS
      })
    ).toEqual({
      ...initialStorageState,
      fileList: [{ a: 1 }, { c: 3 }]
    })
  })

  it('APP_CLEAR_DATA', () => {
    expect(
      storageReducer({
        ...initialStorageState,
        fileList: [1, 2, 3],
        fileToDelete: 'something'
      }, {
        type: types.APP_CLEAR_DATA,
        payload: 'something'
      })
    ).toEqual(initialStorageState)
  })
})
