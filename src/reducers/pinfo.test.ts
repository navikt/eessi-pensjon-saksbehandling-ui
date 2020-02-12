import * as types from 'constants/actionTypes'
import pinfoReducer, { initialPinfoState } from './pinfo'

describe('reducers/pinfo', () => {
  it('PINFO_INVITE_REQUEST', () => {
    expect(
      pinfoReducer({
        ...initialPinfoState,
        invite: {
          message: 'something',
          status: 'OK'
        }
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

  it('UNKNOWN_ACTION', () => {
    expect(
      pinfoReducer(initialPinfoState, {
        type: 'UNKNOWN_ACTION'
      })
    ).toEqual(initialPinfoState)
  })
})
