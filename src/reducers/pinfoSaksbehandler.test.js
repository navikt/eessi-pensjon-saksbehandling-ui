import pinfoSaksbehandlerReducer from './pinfoSaksbehandler.js'
import * as types from '../constants/actionTypes'

describe('pinfoSaksbehandler reducer', () => {

  let initialState = {
    message: undefined,
    status: undefined
  }

  it('handles PINFO_INVITE_FAILURE action', () => {

    let state = pinfoSaksbehandlerReducer(initialState, {
      type: types.PINFO_INVITE_FAILURE,
    })
    expect(state.message).toBe('pinfo:alert-inviteFailure')
    expect(state.stsatus).toBe('ERROR')
  })

  it('handles PINFO_INVITE_SUCCESS action', () => {

    let state = pinfoSaksbehandlerReducer(initialState, {
      type: types.PINFO_INVITE_SUCCESS,
    })
    expect(state.message).toBe('pinfo:alert-inviteSuccess')
    expect(state.stsatus).toBe('OK')
  })
})
