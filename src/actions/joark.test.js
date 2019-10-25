import _ from 'lodash'
import { call } from 'eessi-pensjon-ui/dist/api'
import * as joarkActions from 'actions/joark'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import sampleJoark from 'resources/tests/sampleJoark'
const sprintf = require('sprintf-js').sprintf
jest.mock('eessi-pensjon-ui/dist/api', () => ({
  call: jest.fn()
}))

describe('actions/joark', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('listJoarkFiles()', () => {
    const mockUserId = 123
    joarkActions.listJoarkFiles(mockUserId)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.JOARK_LIST_REQUEST,
        success: types.JOARK_LIST_SUCCESS,
        failure: types.JOARK_LIST_FAILURE
      },
      url: sprintf(urls.API_JOARK_LIST_URL, { userId: mockUserId })
    }))
  })

  it('previewJoarkFile()', () => {
    const mockItem = {
      journalpostId: '1',
      dokumentInfoId: '4'
    }
    const mockVariant = {
      variantformat: 'mockVariant'
    }
    joarkActions.previewJoarkFile(mockItem, mockVariant)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.JOARK_PREVIEW_REQUEST,
        success: types.JOARK_PREVIEW_SUCCESS,
        failure: types.JOARK_PREVIEW_FAILURE
      },
      context: {
        ...mockItem,
        variant: mockVariant
      },
      url: sprintf(urls.API_JOARK_GET_URL, {
        dokumentInfoId: mockItem.dokumentInfoId,
        journalpostId: mockItem.journalpostId,
        variantFormat: mockVariant.variantformat
      })
    }))
  })

  it('getJoarkFile()', () => {
    const mockItem = {
      journalpostId: '1',
      dokumentInfoId: '4'
    }
    const mockVariant = {
      variantformat: 'mockVariant'
    }
    joarkActions.getJoarkFile(mockItem, mockVariant)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.JOARK_GET_REQUEST,
        success: types.JOARK_GET_SUCCESS,
        failure: types.JOARK_GET_FAILURE
      },
      context: {
        ...mockItem,
        variant: mockVariant
      },
      url: sprintf(urls.API_JOARK_GET_URL, {
        dokumentInfoId: mockItem.dokumentInfoId,
        journalpostId: mockItem.journalpostId,
        variantFormat: mockVariant.variantformat
      })
    }))
  })

  it('getMockedPayload() in localhost, test environment will not used mocked values', () => {
    const mockJournalpostId = '1'
    const generatedResult = joarkActions.getMockedPayload(mockJournalpostId)
    expect(generatedResult).toEqual(undefined)
  })

  it('getMockedPayload() in localhost, non-test environment will use mocked values for local development', () => {
    jest.resetModules()
    jest.mock('constants/environment', () => {
      return { IS_TEST: false }
    })
    const mockJournalpostId = '1'
    const newJoarkActions = require('actions/joark')
    const expectedItem = _.find(sampleJoark.mockdata.data.dokumentoversiktBruker.journalposter, { journalpostId: mockJournalpostId })
    const generatedResult = newJoarkActions.getMockedPayload(mockJournalpostId)
    expect(generatedResult).toMatchObject({
      fileName: expectedItem.tittel,
      contentType: 'application/pdf',
      filInnhold: sampleJoark.files[expectedItem.tittel]
    })
  })
})
