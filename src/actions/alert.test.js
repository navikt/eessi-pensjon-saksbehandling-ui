import * as alertActions from './alert'
import * as types from '../constants/actionTypes'

describe('alert actions', () => {
  it('call clientClear()', () => {
    const generatedResult = alertActions.clientClear()
    expect(generatedResult).toMatchObject({
      type: types.ALERT_CLIENT_CLEAR
    })
  })
})
