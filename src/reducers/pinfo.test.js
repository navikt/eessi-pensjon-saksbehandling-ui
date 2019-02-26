import pinfoReducer from './pinfo.js'
import * as types from '../constants/actionTypes'

describe('pinfo reducer', () => {

  it('reacts to PINFO_STEP_SET action', () => {

    let mockStep = 999
    let state = pinfoReducer({}, {
        type: types.PINFO_STEP_SET,
        payload: mockStep
    })
    expect(state.step).toEqual(mockStep)
  })

})
