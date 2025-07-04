import * as personActions from 'src/actions/person'
import * as types from 'src/constants/actionTypes'
import * as urls from 'src/constants/urls'
import { call as originalCall } from '@navikt/fetch'

jest.mock('@navikt/fetch', () => ({
  call: jest.fn()
}))
const call: jest.Mock = originalCall as jest.Mock<typeof originalCall>
const sprintf = require('sprintf-js').sprintf

describe('actions/app', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('getPersonAvdodInfo()', () => {
    const mockAktoerId: string = '123'
    const mockVedtakId: string = '456'
    personActions.getPersonAvdodInfo(mockAktoerId, mockVedtakId, undefined)
    expect(call).toHaveBeenCalledWith(expect.objectContaining({
      type: {
        request: types.PERSON_AVDOD_REQUEST,
        success: types.PERSON_AVDOD_SUCCESS,
        failure: types.PERSON_AVDOD_FAILURE
      },
      url: sprintf(urls.PERSON_AVDOD_URL, { aktoerId: mockAktoerId, vedtakId: mockVedtakId })
    }))
  })

  it('getPersonInfo()', () => {
    const mockAktoerId: string = '123'
    personActions.getPersonInfo(mockAktoerId)
    expect(call).toHaveBeenCalledWith(expect.objectContaining({
      type: {
        request: types.PERSON_PDL_REQUEST,
        success: types.PERSON_PDL_SUCCESS,
        failure: types.PERSON_PDL_FAILURE
      },
      url: sprintf(urls.PERSON_PDL_URL, { aktoerId: mockAktoerId })
    }))
  })
})
