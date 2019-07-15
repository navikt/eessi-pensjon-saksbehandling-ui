import * as joarkActions from 'actions/joark'
import * as api from 'actions/api'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import sampleJoark from 'resources/tests/sampleJoark'
var sprintf = require('sprintf-js').sprintf

urls.HOST = 'notlocalhost'

describe('joark actions', () => {
  beforeAll(() => {
    api.call = jest.fn()
  })

  afterEach(() => {
    api.call.mockRestore()
  })

  it('listJoarkFiles()', () => {
    const mockUserId = 123
    joarkActions.listJoarkFiles(mockUserId)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.JOARK_LIST_REQUEST,
        success: types.JOARK_LIST_SUCCESS,
        failure: types.JOARK_LIST_FAILURE
      },
      expectedPayload: sampleJoark.mockdata,
      url: sprintf(urls.API_JOARK_LIST_URL, { userId: mockUserId })
    })
  })

  it('previewJoarkFile()', () => {
    const mockItem = {
      journalpostId: '1',
      dokumentInfoId: '4'
    }
    joarkActions.previewJoarkFile(mockItem)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.JOARK_PREVIEW_REQUEST,
        success: types.JOARK_PREVIEW_SUCCESS,
        failure: types.JOARK_PREVIEW_FAILURE
      },
      expectedPayload: undefined,
      context: mockItem,
      url: sprintf(urls.API_JOARK_GET_URL, { dokumentInfoId: mockItem.dokumentInfoId, journalpostId: mockItem.journalpostId })
    })
  })

  it('getJoarkFile()', () => {
    const mockVariant = 'DUMMY'
    const mockItem = {
      journalpostId: '1',
      dokumentInfoId: '4',
      variant: mockVariant
    }
    joarkActions.getJoarkFile(mockItem, mockVariant)
    expect(api.call).toBeCalledWith({
      type: {
        request: types.JOARK_GET_REQUEST,
        success: types.JOARK_GET_SUCCESS,
        failure: types.JOARK_GET_FAILURE
      },
      expectedPayload: undefined,
      context: mockItem,
      url: sprintf(urls.API_JOARK_GET_URL, {
        dokumentInfoId: mockItem.dokumentInfoId,
        journalpostId: mockItem.journalpostId,
        variant: mockVariant })
    })
  })

  it('getMockedPayload()', () => {
    const mockJournalpostId = '1'
    const expectedItem = _.find(sampleJoark.mockdata.data.dokumentoversiktBruker.journalposter, { journalpostId: mockJournalpostId })
    const generatedResult = joarkActions.getMockedPayload(mockJournalpostId)
    expect(generatedResult).toMatchObject({
      fileName: expectedItem.tittel,
      contentType: 'application/pdf',
      base64: sampleJoark.files[item.tittel]
    })
  })
})
