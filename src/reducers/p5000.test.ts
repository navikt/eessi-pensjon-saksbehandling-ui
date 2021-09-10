import * as types from 'constants/actionTypes'
import p5000Reducer, { initialP5000State } from 'reducers/p5000'

describe('reducers/p5000', () => {
  it('P5000_GET_SUCCESS', () => {
    expect(
      p5000Reducer({
        ...initialP5000State,
        p5000FromRinaMap: {
          1: 'somePayload'
        }
      }, {
        type: types.P5000_GET_SUCCESS,
        payload: 'mockPayload',
        context: {
          id: 2
        }
      })
    ).toEqual({
      ...initialP5000State,
      p5000FromRinaMap: {
        1: 'somePayload',
        2: 'mockPayload'
      }
    })
  })
})
