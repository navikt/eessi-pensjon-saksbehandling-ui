import * as alertActions from 'actions/alert'
import * as types from 'constants/actionTypes'

describe('actions/alert', () => {
  it('clientClear()', () => {
    const generatedResult = alertActions.clientClear()
    expect(generatedResult).toMatchObject({
      type: types.ALERT_CLIENT_CLEAR
    })
  })
})
