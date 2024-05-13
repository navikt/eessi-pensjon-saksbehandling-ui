import * as types from 'src/constants/actionTypes'
import p5000Reducer, { initialP5000State } from 'src/reducers/p5000'
import mockSed1 from 'src/mocks/buc/sed_P5000_small1'
import mockSed2 from 'src/mocks/buc/sed_P5000_small2'

describe('reducers/p5000', () => {
  it('P5000_GET_SUCCESS', () => {
    expect(
      p5000Reducer({
        ...initialP5000State,
        p5000sFromRinaMap: {
          1: mockSed1
        }
      }, {
        type: types.P5000_GET_SUCCESS,
        payload: mockSed2,
        context: {
          id: 2
        }
      })
    ).toEqual({
      ...initialP5000State,
      p5000sFromRinaMap: {
        1: mockSed1,
        2: mockSed2
      }
    })
  })
})
