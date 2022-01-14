import * as p5000Actions from 'actions/p5000'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { Sed } from 'declarations/buc'
import { P5000SED } from 'declarations/p5000'
import { call as originalCall } from 'js-fetch-api'
import mockSedP5000 from 'mocks/buc/sed_P5000_small1'

const sprintf = require('sprintf-js').sprintf
jest.mock('js-fetch-api', () => ({
  call: jest.fn()
}))
const call = originalCall as jest.Mock<typeof originalCall>

describe('actions/p5000', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('getSed()', () => {
    const mockCaseId = '123'
    const mockSed = {
      id: '456'
    } as Sed
    p5000Actions.getSed(mockCaseId, mockSed)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.P5000_GET_REQUEST,
        success: types.P5000_GET_SUCCESS,
        failure: types.P5000_GET_FAILURE
      },
      url: sprintf(urls.P5000_GET_URL, { caseId: mockCaseId, sedId: mockSed.id })
    }))
  })

  it('resetSentP5000info()', () => {
    const generatedResult = p5000Actions.resetSentP5000info()
    expect(generatedResult).toMatchObject({
      type: types.P5000_SEND_RESET
    })
  })

  it('sendP5000toRina()', () => {
    const mockCaseId = '123'
    const mockSedId = '456'
    const mockPayload = mockSedP5000 as P5000SED
    p5000Actions.sendP5000toRina(mockCaseId, mockSedId, mockPayload)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.P5000_SEND_REQUEST,
        success: types.P5000_SEND_SUCCESS,
        failure: types.P5000_SEND_FAILURE
      },
      url: sprintf(urls.P5000_PUT_URL, { caseId: mockCaseId, sedId: mockSedId })
    }))
  })
})
