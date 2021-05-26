import * as p5000Actions from 'actions/p5000'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { Sed } from 'declarations/buc'
import { call as originalCall } from 'js-fetch-api'

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
      url: sprintf(urls.P5000_GET_URL, { caseId: mockCaseId, documentId: mockSed.id })
    }))
  })
})
