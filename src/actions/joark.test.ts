import * as joarkActions from 'actions/joark'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { JoarkFile } from 'declarations/joark'
import { call as originalCall } from 'js-fetch-api'
import _ from 'lodash'
import mockJoarkRaw from 'mocks/joark/joarkRaw'
import mockJoarkPayload from 'mocks/joark/payload'

const sprintf = require('sprintf-js').sprintf
jest.mock('js-fetch-api', () => ({
  call: jest.fn()
}))
const call = originalCall as jest.Mock<typeof originalCall>

describe('actions/joark', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })
  const mockItem: JoarkFile = {
    tittel: 'tittel',
    tema: 'tema',
    datoOpprettet: new Date(1970, 1, 1),
    journalpostId: '1',
    dokumentInfoId: '4',
    variant: {
      variantformat: 'mockVariant',
      filnavn: 'mockFilnavn'
    }
  }

  it('listJoarkFiles()', () => {
    const mockUserId = '123'
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

  it('getPreviewJoarkFile()', () => {
    joarkActions.getPreviewJoarkFile(mockItem)
    expect(call).toBeCalledWith(expect.objectContaining({
      type: {
        request: types.JOARK_PREVIEW_REQUEST,
        success: types.JOARK_PREVIEW_SUCCESS,
        failure: types.JOARK_PREVIEW_FAILURE
      },
      context: mockItem,
      url: sprintf(urls.API_JOARK_GET_URL, {
        dokumentInfoId: mockItem.dokumentInfoId,
        journalpostId: mockItem.journalpostId,
        variantformat: mockItem.variant.variantformat
      })
    }))
  })

  it('setPreviewJoarkFile()', () => {
    const generatedResult = joarkActions.setPreviewJoarkFile(mockItem)
    expect(generatedResult).toMatchObject({
      type: types.JOARK_PREVIEW_SET,
      payload: mockItem
    })
  })

  it('getMockedPayload() in localhost, test environment will not used mocked values', () => {
    const mockJournalpostId = '1'
    const generatedResult = mockJoarkPayload(mockJournalpostId)
    expect(generatedResult).toEqual(undefined)
  })

  it('getMockedPayload() in localhost, non-test environment will use mocked values for local development', () => {
    jest.resetModules()
    jest.mock('constants/environment', () => {
      return { IS_TEST: false }
    })
    const mockJournalpostId = '1'
    const newMockJoarkPayload = require('mocks/joark/payload').default
    const expectedItem = _.find(mockJoarkRaw.data.dokumentoversiktBruker.journalposter, { journalpostId: mockJournalpostId })
    const generatedResult = newMockJoarkPayload(mockJournalpostId)
    const tittel = expectedItem ? expectedItem.tittel : ''
    expect(generatedResult).toMatchObject({
      fileName: tittel,
      contentType: 'application/pdf',
      filInnhold: mockJoarkRaw.files[tittel]
    })
  })
})
