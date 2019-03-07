import pinfoReducer from './pinfo.js'
import * as types from '../constants/actionTypes'

describe('pinfo reducer', () => {

  let initialState = {
    isReady: false,
    step: 0,
    maxStep: 0,
    stepError: undefined,
    person: {},
    bank: {},
    stayAbroad: [],
    receipt: undefined,
    buttonsVisible: true
  }

  it('handles PINFO_STEP_SET action', () => {
    let firstMockStep = 998
    let state = pinfoReducer(initialState, {
      type: types.PINFO_STEP_SET,
      payload: firstMockStep
    })
    expect(state.step).toEqual(firstMockStep)
    expect(state.maxStep).toEqual(firstMockStep)

    let secondMockStep = 997
    state = pinfoReducer(state, {
      type: types.PINFO_STEP_SET,
      payload: secondMockStep
    })
    expect(state.step).toEqual(secondMockStep)
    expect(state.maxStep).toEqual(firstMockStep)

    let lastMockStep = 999
    state = pinfoReducer(state, {
      type: types.PINFO_STEP_SET,
      payload: lastMockStep
    })
    expect(state.step).toEqual(lastMockStep)
    expect(state.maxStep).toEqual(lastMockStep)
  })

  it('handles PINFO_STEP_ERROR action', () => {
    let mockError = 'mockError'
    let state = pinfoReducer(initialState, {
      type: types.PINFO_STEP_ERROR,
      payload: mockError
    })
    expect(state.stepError).toEqual(mockError)
  })

  it('handles PINFO_PERSON_SET action', () => {
    let mockPersonValues = {foo: 'bar'}
    let state = pinfoReducer(initialState, {
      type: types.PINFO_PERSON_SET,
      payload: mockPersonValues
    })
    expect(state.person).toHaveProperty('foo', 'bar')
  })

  it('handles PINFO_BANK_SET action', () => {
    let mockBankValues = {foo: 'bar'}
    let state = pinfoReducer(initialState, {
      type: types.PINFO_BANK_SET,
      payload: mockBankValues
    })
    expect(state.bank).toHaveProperty('foo', 'bar')
  })

  it('handles PINFO_STAY_ABROAD_SET action', () => {
    let mockStayAbroadValues = [{id: 1, startDate: 10}, {id: 2, startDate: 20}, {id: 3, startDate: 15}]
    let state = pinfoReducer(initialState, {
      type: types.PINFO_STAY_ABROAD_SET,
      payload: mockStayAbroadValues
    })
    expect(state.stayAbroad).toEqual([{id: 1, startDate: 10}, {id: 3, startDate: 15}, {id: 2, startDate: 20}])
  })

  it('handles PINFO_COMMENT_SET action', () => {
    let mockComment = 'mockComment'
    let state = pinfoReducer(initialState, {
      type: types.PINFO_COMMENT_SET,
      payload: mockComment
    })
    expect(state.comment).toBe(mockComment)
  })

  it('handles PINFO_SEND_SUCCESS action', () => {
    let mockSend = {foo: 'bar'}
    let state = pinfoReducer(initialState, {
      type: types.PINFO_SEND_SUCCESS,
      payload: mockSend
    })
    expect(state.send).toBe(mockSend)
  })

  it('handles PINFO_SEND_FAILURE action', () => {
    let state = Object.assign({}, initialState, {
       send: {foo: 'bar'}
    })
    state = pinfoReducer(initialState, {
      type: types.PINFO_SEND_FAILURE,
    })
    expect(state.send).toBe(undefined)
  })

  it('handles PINFO_SET_READY action', () => {
    let state = pinfoReducer(initialState, {
      type: types.PINFO_SET_READY
    })
    expect(state.isReady).toBe(true)
  })

  it('handles PINFO_PAGE_ERRORS_SET action', () => {
    let mockPageError = {
       pageErrors: 'mockPageErrors',
       errorTimestamp: new Date().getTime()
    }
    let state = pinfoReducer(initialState, {
      type: types.PINFO_PAGE_ERRORS_SET,
      payload: mockPageError
    })
    expect(state.pageErrors).toEqual(mockPageError.pageErrors)
    expect(state.errorTimestamp).toEqual(mockPageError.errorTimestamp)

  })

  it('handles PINFO_RECEIPT_SUCCESS action', () => {
    let mockReceipt = {foo: 'bar'}
    let state = pinfoReducer(initialState, {
      type: types.PINFO_RECEIPT_SUCCESS,
      payload: mockReceipt
    })
    expect(state.receipt).toBe(mockReceipt)
  })

  it('handles PINFO_RECEIPT_FAILURE action', () => {
    let state = Object.assign({}, initialState, {
       receipt: {foo: 'bar'}
    })
    state = pinfoReducer(initialState, {
      type: types.PINFO_RECEIPT_FAILURE,
    })
    expect(state.receipt).toBe(undefined)
  })

  it('handles PINFO_GET_FROM_STORAGE_SUCCESS action', () => {
    let extraState = {foo: 'bar'}
    let state = pinfoReducer({}, {
      type: types.PINFO_GET_FROM_STORAGE_SUCCESS,
      payload: extraState
    })
    expect(state).toHaveProperty('foo', 'bar')
    expect(state.isReady).toBe(true)
  })

  it('handles PINFO_BUTTONS_VISIBLE action', () => {
    expect(initialState.buttonsVisible).toBe(true)
    let state = pinfoReducer(initialState, {
      type: types.PINFO_BUTTONS_VISIBLE,
      payload: false
    })
    expect(state.buttonsVisible).toBe(false)
  })

  it('handles PINFO_CLEAR_DATA action', () => {
    let state = Object.assign({}, initialState, {foo: 'bar'})
    state = pinfoReducer(state, {
      type: types.PINFO_CLEAR_DATA,
      payload: false
    })
    expect(state).toEqual(initialState)
  })

  it('handles APP_CLEAR_DATA action', () => {
    let state = Object.assign({}, initialState, {foo: 'bar'})
    state = pinfoReducer(state, {
      type: types.APP_CLEAR_DATA,
      payload: false
    })
    expect(state).toEqual(initialState)
  })
})
