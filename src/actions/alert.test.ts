import * as alertActions from 'actions/alert'
import * as types from 'constants/actionTypes'

describe('actions/alert', () => {
  it('alertClear()', () => {
    const generatedResult = alertActions.alertClear()
    expect(generatedResult).toMatchObject({
      type: types.ALERT_CLEAR
    })
  })

  it('alertFailure()', () => {
    const mockPayload: string = 'mockError'
    const generatedResult = alertActions.alertFailure(mockPayload)
    expect(generatedResult).toMatchObject({
      type: types.ALERT_FAILURE,
      payload: mockPayload
    })
  })
})
