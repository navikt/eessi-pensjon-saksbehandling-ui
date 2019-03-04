import * as pinfoActions from './pinfo.js'
import * as types from '../constants/actionTypes'

import * as constants from '../constants/constants'
import * as api from './api'
import * as storageActions from './storage'

import configureMockStore  from 'redux-mock-store'
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

const mockStore = configureMockStore ([thunk])

describe('pinfo actions', () => {

  let store

  beforeAll(() => {
    store = mockStore(initialState)
    api.call = jest.fn()
    storageActions.deleteAllStorageFilesFromUser = jest.fn()
  })

  afterAll(() => {
    api.call.mockRestore()
    storageActions.deleteAllStorageFilesFromUser.mockRestore()
  })

  it('call setStep()', () => {
    const step = 999
    const generatedResult = pinfoActions.setStep(step)
    expect(generatedResult).toMatchObject({
      type: types.PINFO_STEP_SET,
      payload: step
    })
  })

  it('call setStepError()', () => {
    const stepError = 'stepError'
    const generatedResult = pinfoActions.setStepError(stepError)
    expect(generatedResult).toMatchObject({
      type: types.PINFO_STEP_ERROR,
      payload: stepError
    })
  })

  it('call setPerson()', () => {
    const person = { person: 'person' }
    const generatedResult = pinfoActions.setPerson(person)
    expect(generatedResult).toMatchObject({
      type: types.PINFO_PERSON_SET,
      payload: person
    })
  })

  it('call setBank()', () => {
    const bank = { bank: 'bank' }
    const generatedResult = pinfoActions.setBank(bank)
    expect(generatedResult).toMatchObject({
      type: types.PINFO_BANK_SET,
      payload: bank
    })
  })

  it('call setStayAbroad()', () => {
    const stayAbroad = { stayAbroad: 'stayAbroad' }
    const generatedResult = pinfoActions.setStayAbroad(stayAbroad)
    expect(generatedResult).toMatchObject({
      type: types.PINFO_STAY_ABROAD_SET,
      payload: stayAbroad
    })
  })

  it('call setComment()', () => {
    const comment = { comment: 'comment' }
    const generatedResult = pinfoActions.setComment(comment)
    expect(generatedResult).toMatchObject({
      type: types.PINFO_COMMENT_SET,
      payload: comment
    })
  })

  it('call setMainButtonsVisibility()', () => {
    const value = { value: 'value' }
    const generatedResult = pinfoActions.setMainButtonsVisibility(value)
    expect(generatedResult).toMatchObject({
      type: types.PINFO_BUTTONS_VISIBLE,
      payload: value
    })
  })

  it('call setPageErrors()', () => {
    const errors = { errorX: 'errorX' }
    const expectedDate = new Date().getTime()
    const generatedResult = pinfoActions.setPageErrors(errors)
    expect(generatedResult).toHaveProperty('type', types.PINFO_PAGE_ERRORS_SET)
    expect(generatedResult).toHaveProperty('payload.pageErrors', errors)
    expect(generatedResult).toHaveProperty('payload.errorTimestamp')
    expect(generatedResult.payload.errorTimestamp).toBeCloseTo(expectedDate, 100)
  })

  it('call sendPInfo()', () => {

    const sendPInfo = { pinfo: 'pinfo' }
    pinfoActions.sendPInfo(sendPInfo)
    expect(api.call).toBeCalledWith({
      method: 'POST',
      payload: sendPInfo,
      type: {
        request: types.PINFO_SEND_REQUEST,
        success: types.PINFO_SEND_SUCCESS,
        failure: types.PINFO_SEND_FAILURE
      },
      url: 'http://localhost/api/submission/submit'
    })
  })

  it('call sendInvite()', () => {
    pinfoActions.sendInvite({
      sakId: '123',
      aktoerId: '456'
    })
    expect(api.call).toBeCalledWith({
      method: 'POST',
      payload: {},
      type: {
        request: types.PINFO_INVITE_REQUEST,
        success: types.PINFO_INVITE_SUCCESS,
        failure: types.PINFO_INVITE_FAILURE
      },
      url: 'http://localhost/api/varsel?saksId=123&aktoerId=456'
    })
  })

  it('call generateReceipt()', () => {
    pinfoActions.generateReceipt({
      sakId: '123',
      aktoerId: '456'
    })
    expect(api.call).toBeCalledWith({
      method: 'GET',
      type: {
        request: types.PINFO_RECEIPT_REQUEST,
        success: types.PINFO_RECEIPT_SUCCESS,
        failure: types.PINFO_RECEIPT_FAILURE
      },
      url: 'http://localhost/api/submission/receipt'
    })
  })

  it('call clearPInfoData()', () => {
    const generatedResult = pinfoActions.clearPInfoData()
    expect(generatedResult).toMatchObject({
      type: types.PINFO_CLEAR_DATA
    })
  })

  it('call saveStateAndExit()', () => {
    const mockPinfo = { pinfo: 'pinfo' }
    const mockUsername = '123456867910'

    storageActions.postStorageFileWithNoNotification = jest.fn()
    storageActions.postStorageFileWithNoNotification.mockReturnValue(() => {
       return Promise.resolve({
        type: types.STORAGE_POST_NO_NOTIF_SUCCESS,
        payload: {success: 'true'}
      })
    })

    Object.defineProperty(window, 'location', {
     writable: true,
     value: {}
    })

    store.dispatch(pinfoActions.saveStateAndExit(mockPinfo, mockUsername)).then(() => {
      expect(storageActions.postStorageFileWithNoNotification).toBeCalledWith(
        mockUsername,
        constants.PINFO,
        constants.PINFO_FILE,
        JSON.stringify(mockPinfo)
      )
      expect(window.location.href).toEqual("dsds")
    })
    storageActions.postStorageFileWithNoNotification.mockRestore()
  })

  it('call deleteStateAndExit()', () => {
    const mockUsername = '123456867910'

    storageActions.deleteAllStorageFilesFromUser = jest.fn()
    storageActions.deleteAllStorageFilesFromUser.mockReturnValue(() => {
      return Promise.resolve({
        type: types.STORAGE_MULTIPLE_DELETE_SUCCESS,
        payload: {success: 'true'}
      })
    })

    Object.defineProperty(window, 'location', {
     writable: true,
     value: {}
    })

    store.dispatch(pinfoActions.deleteStateAndExit(mockUsername)).then(() => {
       expect(storageActions.deleteAllStorageFilesFromUser).toBeCalledWith(
        mockUsername,
        constants.PINFO
      )
      expect(window.location.href).toEqual("dsds")

    })

    storageActions.deleteAllStorageFilesFromUser.mockRestore()
  })

  it('call setReady()', () => {
    const generatedResult = pinfoActions.setReady()
    expect(generatedResult).toMatchObject({
      type: types.PINFO_SET_READY
    })
  })
})
