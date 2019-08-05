import pinfoReducer, { initialPinfoState } from './pinfo.js'
import * as types from 'constants/actionTypes'

describe('reducers/pinfo', () => {
  it('PINFO_INVITE_REQUEST', () => {
    expect(
      pinfoReducer({
        ...initialPinfoState,
        invite: 'something'
      }, {
        type: types.PINFO_INVITE_REQUEST
      })
    ).toEqual(initialPinfoState)
  })

  it('PINFO_INVITE_FAILURE', () => {
    expect(
      pinfoReducer(initialPinfoState, {
        type: types.PINFO_INVITE_FAILURE
      })
    ).toEqual({
      ...initialPinfoState,
      invite: {
        message: 'pinfo:alert-inviteFailure',
        status: 'ERROR'
      }
    })
  })

  it('PINFO_INVITE_SUCCESS', () => {
    expect(
      pinfoReducer(initialPinfoState, {
        type: types.PINFO_INVITE_SUCCESS
      })
    ).toEqual({
      ...initialPinfoState,
      invite: {
        message: 'pinfo:alert-inviteSuccess',
        status: 'OK'
      }
    })
  })
})
