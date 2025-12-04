import * as joarkActions from 'src/actions/joark'
import * as types from 'src/constants/actionTypes'
import * as urls from 'src/constants/urls'
import { call as originalCall } from '@navikt/fetch'
import mockPreview from 'src/mocks/joark/preview'
import mockItems from 'src/mocks/joark/items'

const sprintf = require('sprintf-js').sprintf
jest.mock('@navikt/fetch', () => ({
  call: jest.fn()
}))

jest.mock('src/constants/environment.ts', () => {
  return {
    IS_PRODUCTION: 'production',
    IS_TEST: 'test'
  };
})

const call = originalCall as jest.Mock<typeof originalCall>

describe('actions/joark', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('listJoarkItems()', () => {
    const mockUserId = '123'
    joarkActions.listJoarkItems(mockUserId)
    expect(call).toHaveBeenCalledWith(expect.objectContaining({
      type: {
        request: types.JOARK_LIST_REQUEST,
        success: types.JOARK_LIST_SUCCESS,
        failure: types.JOARK_LIST_FAILURE
      },
      url: sprintf(urls.API_JOARK_LIST_URL, { userId: mockUserId })
    }))
  })

  it('getJoarkItemPreview()', () => {
    joarkActions.getJoarkItemPreview(mockItems[0])
    expect(call).toHaveBeenCalledWith(expect.objectContaining({
      type: {
        request: types.JOARK_PREVIEW_REQUEST,
        success: types.JOARK_PREVIEW_SUCCESS,
        failure: types.JOARK_PREVIEW_FAILURE
      },
      context: mockItems[0],
      url: sprintf(urls.API_JOARK_GET_URL, {
        dokumentInfoId: mockItems[0].dokumentInfoId,
        journalpostId: mockItems[0].journalpostId,
        variantformat: mockItems[0].variant!.variantformat
      })
    }))
  })

  it('setJoarkItemPreview()', () => {
    const generatedResult = joarkActions.setJoarkItemPreview(mockItems[0])
    expect(generatedResult).toMatchObject({
      type: types.JOARK_PREVIEW_SET,
      payload: mockItems[0]
    })
  })

  it('getMockedPayload() in localhost, test environment will not used mocked values', () => {
    const generatedResult = mockPreview()
    expect(generatedResult).toEqual(undefined)
  })

  it('getMockedPayload() in localhost, non-test environment will use mocked values for local development', () => {
    jest.resetModules()
    jest.mock('src/constants/environment', () => {
      return { IS_TEST: false }
    })
    const newMockPreviewfile = require('src/mocks/joark/preview').default
    const generatedResult = newMockPreviewfile()
    expect(generatedResult).toHaveProperty('fileName')
    expect(generatedResult).toHaveProperty('contentType', 'application/pdf')
    expect(generatedResult).toHaveProperty('filInnhold')
  })
})
