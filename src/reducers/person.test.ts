import * as types from 'src/constants/actionTypes'
import appReducer, { initialAppState } from 'src/reducers/app'

describe('reducers/person', () => {
  it('PERSON_PDL_SUCCESS', () => {
    expect(
      appReducer(initialAppState, {
        type: types.PERSON_PDL_SUCCESS,
        payload: {
          foo: 'mockPayload'
        }
      })
    ).toEqual({
      ...initialAppState,
      person: {
        foo: 'mockPayload'
      }
    })
  })

  it('PERSON_AVDOD_SUCCESS', () => {
    expect(
      appReducer(initialAppState, {
        type: types.PERSON_AVDOD_SUCCESS,
        payload: 'mockPayload'
      })
    ).toEqual({
      ...initialAppState,
      personAvdods: 'mockPayload'
    })
  })
})
