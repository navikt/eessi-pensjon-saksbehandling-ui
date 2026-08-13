import * as types from 'src/constants/actionTypes'
import p5000Reducer, { initialP5000State } from 'src/reducers/p5000'
import mockSed1 from 'src/mocks/buc/sed_P5000_small1'
import mockSed2 from 'src/mocks/buc/sed_P5000_small2'
import mockP5000FromS3 from 'src/mocks/p5000/fromS3'

describe('reducers/p5000', () => {
  it('P5000_PESYS_GET_SUCCESS', () => {
    expect(
      p5000Reducer(initialP5000State, {
        type: types.P5000_PESYS_GET_SUCCESS,
        payload: { result: mockP5000FromS3, status: 'OK' }
      })
    ).toEqual({
      ...initialP5000State,
      p5000sFromS3: mockP5000FromS3
    })
  })

  it('SED_P5000_GET_SUCCESS', () => {
    expect(
      p5000Reducer({
        ...initialP5000State,
        p5000sFromRinaMap: {
          1: mockSed1
        }
      }, {
        type: types.SED_P5000_GET_SUCCESS,
        payload: { result: mockSed2, status: 'OK' },
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
