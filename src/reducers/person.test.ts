import * as types from 'src/constants/actionTypes'
import personReducer, { initialPersonState } from 'src/reducers/person'

describe('reducers/person', () => {
  it('PERSON_PDL_SUCCESS', () => {
    expect(
      personReducer(initialPersonState, {
        type: types.PERSON_PDL_SUCCESS,
        payload: {
          foo: 'mockPayload'
        }
      })
    ).toEqual({
      ...initialPersonState,
      personPdl: {
        foo: 'mockPayload'
      }
    })
  })

  it('PERSON_AVDOD_SUCCESS', () => {
    expect(
      personReducer(initialPersonState, {
        type: types.PERSON_AVDOD_SUCCESS,
        payload: 'mockPayload'
      })
    ).toEqual({
      ...initialPersonState,
      personAvdods: 'mockPayload'
    })
  })
})
