import pinfoReducer from './pinfo.js'
import * as types from '../constants/actionTypes'

describe('pinfo reducer', () => {
  const initialState = {
    invite: undefined
  }

  it('handles PINFO_INVITE_FAILURE action', () => {
    const state = pinfoReducer(initialState, {
      type: types.PINFO_INVITE_FAILURE
    })
    expect(state.invite.message).toEqual('pinfo:alert-inviteFailure')
    expect(state.invite.status).toEqual('ERROR')
  })

  it('handles PINFO_INVITE_SUCCESS action', () => {
    const state = pinfoReducer(initialState, {
      type: types.PINFO_INVITE_SUCCESS
    })
    expect(state.invite.message).toEqual('pinfo:alert-inviteSuccess')
    expect(state.invite.status).toEqual('OK')
  })
})
