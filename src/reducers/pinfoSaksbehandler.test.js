import pinfoSaksbehandlerReducer from './pinfoSaksbehandler.js'
import * as types from '../constants/actionTypes'

describe('pinfoSaksbehandler reducer', () => {
  let initialSaksbehandlerState = {
    invite: undefined,
    sakType: undefined
  }

  it('handles PINFO_INVITE_FAILURE action', () => {
    let state = pinfoSaksbehandlerReducer(initialSaksbehandlerState, {
      type: types.PINFO_INVITE_FAILURE
    })
    expect(state.invite.message).toEqual('pinfo:alert-inviteFailure')
    expect(state.invite.status).toEqual('ERROR')
  })

  it('handles PINFO_INVITE_SUCCESS action', () => {
    let state = pinfoSaksbehandlerReducer(initialSaksbehandlerState, {
      type: types.PINFO_INVITE_SUCCESS
    })
    expect(state.invite.message).toEqual('pinfo:alert-inviteSuccess')
    expect(state.invite.status).toEqual('OK')
  })

  it('handles PINFO_SAKTYPE_SUCCESS action', () => {
    let state = pinfoSaksbehandlerReducer(initialSaksbehandlerState, {
      type: types.PINFO_SAKTYPE_SUCCESS,
      payload: { sakId: '123', aktoerId: '456' }
    })
    expect(state.sakType.sakId).toEqual('123')
    expect(state.sakType.aktoerId).toEqual('456')
  })
})
