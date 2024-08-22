import * as types from 'src/constants/actionTypes'
import sentryReducer, { ApiRejectedAction, initialSentryState } from './sentry'
import * as Sentry from '@sentry/browser'

jest.mock('@sentry/browser', () => ({
  captureEvent: jest.fn(),
  Severity: {
    Error: 'Error'
  }
}))

const mockError = new Error('mockError')

describe('reducers/sentry', () => {
  it('API_CALL_REJECTED', () => {
    (Sentry.captureEvent as jest.Mock).mockReset()
    expect(
      sentryReducer(initialSentryState, {
        type: types.API_CALL_REJECTED,
        error: mockError
      } as ApiRejectedAction)
    ).toEqual({
      ...initialSentryState,
      error: mockError
    })

    expect(Sentry.captureEvent).toHaveBeenCalled()
  })
})
