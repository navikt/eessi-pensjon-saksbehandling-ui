import * as p5000Actions from 'src/actions/p5000'
import * as types from 'src/constants/actionTypes'
import * as storage from 'src/constants/storage'
import * as urls from 'src/constants/urls'
import { Sed } from 'src/declarations/buc'
import { P5000SED } from 'src/declarations/p5000'
import { call as originalCall } from '@navikt/fetch'
import mockSedP5000 from 'src/mocks/buc/sed_P5000_small1'
import mockP5000FromS3 from 'src/mocks/p5000/fromS3'

const sprintf = require('sprintf-js').sprintf
jest.mock('@navikt/fetch', () => ({
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
    expect(call).toHaveBeenCalledWith(expect.objectContaining({
      type: {
        request: types.SED_P5000_GET_REQUEST,
        success: types.SED_P5000_GET_SUCCESS,
        failure: types.SED_P5000_GET_FAILURE
      },
      url: sprintf(urls.SED_P5000_GET_URL, { caseId: mockCaseId, sedId: mockSed.id })
    }))
  })

  it('resetSentP5000info()', () => {
    const generatedResult = p5000Actions.resetSentP5000info()
    expect(generatedResult).toMatchObject({
      type: types.SED_P5000_SEND_RESET
    })
  })

  it('sendP5000toRina()', () => {
    const mockCaseId = '123'
    const mockSedId = '456'
    const mockPayload = mockSedP5000 as P5000SED
    p5000Actions.sendP5000toRina(mockCaseId, mockSedId, mockPayload)
    expect(call).toHaveBeenCalledWith(expect.objectContaining({
      type: {
        request: types.SED_P5000_SEND_REQUEST,
        success: types.SED_P5000_SEND_SUCCESS,
        failure: types.SED_P5000_SEND_FAILURE
      },
      url: sprintf(urls.SED_P5000_PUT_URL, { caseId: mockCaseId, sedId: mockSedId })
    }))
  })

  it('getP5000FromS3()', () => {
    const mockFnr = '123'
    const mockCaseId = '456'
    p5000Actions.getP5000FromS3(mockFnr, mockCaseId)
    expect(call).toHaveBeenCalledWith(expect.objectContaining({
      type: {
        request: types.P5000_PESYS_GET_REQUEST,
        success: types.P5000_PESYS_GET_SUCCESS,
        failure: types.P5000_PESYS_GET_FAILURE
      },
      expectedPayload: { result: mockP5000FromS3, status: 'OK' },
      url: sprintf(urls.API_STORAGE_GET_URL, { userId: mockFnr, namespace: storage.NAMESPACE_PESYS, file: mockCaseId })
    }))
  })
})
