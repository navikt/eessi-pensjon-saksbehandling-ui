import * as attachmentActions from './attachment'
import * as api from './api'
import * as types from '../constants/actionTypes'
import * as storageActions from './storage'

import { APP_LOGOUT_URL, APP_GET_USERINFO_URL } from '../constants/urls'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const initialState = {
  app: {
    username: '123456789210',
    lastName: 'LastName'
  },
  storage: {},
  pinfo: {
    person: {},
    stayAbroad: []
  }
}

const mockStore = configureMockStore([thunk])

describe('attachment actions', () => {
  let store

  beforeAll(() => {
    store = mockStore(initialState)
  })

  it('call addFileToState()', () => {
    const mockFile = { mockfile: 'mockFile' }
    const generatedResult = attachmentActions.addFileToState(mockFile)
    expect(generatedResult).toMatchObject({
      type: types.ATTACHMENT_ADD_FILE_TO_STATE,
      payload: mockFile
    })
  })

  it('call removeFileFromState()', () => {
    const mockFileKey = 'mockFileKey'
    const generatedResult = attachmentActions.removeFileFromState(mockFileKey)
    expect(generatedResult).toMatchObject({
      type: types.ATTACHMENT_REMOVE_FILE_FROM_STATE,
      payload: mockFileKey
    })
  })

  it('call removeFileArrayFromState()', () => {
    const mockFileArray = ['file1', 'file2']
    const generatedResult = attachmentActions.removeFileArrayFromState(mockFileArray)
    expect(generatedResult).toMatchObject({
      type: types.ATTACHMENT_REMOVE_FILE_ARRAY_FROM_STATE,
      payload: mockFileArray
    })
  })

  it('call clearAttachmentState()', () => {
    const generatedResult = attachmentActions.clearAttachmentState()
    expect(generatedResult).toMatchObject({
      type: types.ATTACHMENT_CLEAR_STATE
    })
  })

  it('call getAllStateFromStorage()', () => {
    storageActions.listStorageFiles = jest.fn()
    storageActions.listStorageFiles.mockReturnValue(() => {
      return Promise.resolve({
        type: types.STORAGE_LIST_SUCCESS,
        payload: ['12354678910___PINFO___PINFO.json', '12345678910___PINFO___attachment1.json']
      })
    })

    store.dispatch(
      attachmentActions.getAllStateFromStorage()
    ).then(() => {
      const generatedActions = store.getActions()
      const expectedActions = [
        { type: 'ATTACHMENT/GET/ALL/STATE' },
        { type: 'ATTACHMENT/GET/STORAGE/LIST' },
        { type: 'ATTACHMENT/GET/PINFO/FILE' },
        { type: 'PINFO/SET/READY' },
        { type: 'ATTACHMENT/GET/STORAGE/FILES' },
        { type: 'PINFO/PERSON/SET', payload: { nameAtBirth: 'LastName' } }
      ]
      expect(generatedActions).toEqual(expectedActions)
    })
  })

  it('call syncLocalStateWithStorage()', () => {
    store.dispatch(
      attachmentActions.syncLocalStateWithStorage()
    ).then(() => {
      const generatedActions = store.getActions()
      const expectedActions = [
        { type: 'ATTACHMENT/GET/ALL/STATE' },
        { type: 'ATTACHMENT/GET/STORAGE/LIST' },
        { type: 'ATTACHMENT/GET/PINFO/FILE' },
        { type: 'PINFO/SET/READY' },
        { type: 'ATTACHMENT/GET/STORAGE/FILES' },
        { type: 'PINFO/PERSON/SET', payload: { nameAtBirth: 'LastName' } },
        { type: 'ATTACHMENT/SYNCRONIZE/STATE' },
        { type: 'ATTACHMENT/GET/STORAGE/LIST' },
        { type: 'ATTACHMENT/DELETE/STORAGE/FILES' },
        { type: 'ATTACHMENT/GET/STORAGE/FILES' },
        { type: 'ATTACHMENT/POST/STORAGE/FILES' },
        { type: 'ATTACHMENT/DELETE/LOCAL/ATTACHMENTS' },
        { type: 'ATTACHMENT/STATE/ARRAY/REMOVE', payload: [] }
      ]
      expect(generatedActions).toEqual(expectedActions)
    })
  })
})
