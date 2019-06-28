import * as joarkActions from './joark'
import * as api from './api'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
var sprintf = require('sprintf-js').sprintf
import sampleJoark from 'resources/tests/sampleJoark'

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
    const mockItem = {
      journalpostId: '1',
      dokumentInfoId: '4',

    }
    const mockVariant = 'DUMMY'
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
})
