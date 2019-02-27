import * as pinfoActions from './pinfo.js'
import * as types from '../constants/actionTypes'

describe('pinfo actions', () => {
  it('call setStep()', () => {
    const step = 999
    const generatedResult = pinfoActions.setStep(step)

    expect(generatedResult).toEqual({
      type: types.PINFO_STEP_SET,
      payload: step
    })
  })
})
