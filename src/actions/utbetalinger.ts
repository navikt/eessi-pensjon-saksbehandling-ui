import * as types from 'src/constants/actionTypes'
import * as urls from 'src/constants/urls'
import { ActionWithPayload, call } from '@navikt/fetch'
import { UtbetalingerResponse } from 'src/declarations/p12000'
import mockUtbetalinger from 'src/mocks/utbetalinger/utbetalinger'

// @ts-ignore
import { sprintf } from 'sprintf-js'

export const getUtbetalinger = (
  periodeId: string,
  aktoerId: string,
  sakId: string,
  fom: string,
  tom: string | undefined
): ActionWithPayload<UtbetalingerResponse> => {
  return call({
    url: sprintf(urls.UTBETALINGER_URL, { aktoerId, sakId, fom, tom: tom ?? '' }),
    cascadeFailureError: true,
    expectedPayload: /* istanbul ignore next */ {
      result: {
        ...mockUtbetalinger.utbetalinger,
        periode: { fom, tom }
      }
    },
    context: {
      periodeId
    },
    type: {
      request: types.UTBETALINGER_REQUEST,
      success: types.UTBETALINGER_SUCCESS,
      failure: types.UTBETALINGER_FAILURE
    }
  })
}

export const removeUtbetalinger = (periodeId: string): ActionWithPayload<string> => ({
  type: types.UTBETALINGER_REMOVE,
  payload: periodeId
})

export const resetUtbetalinger = () => ({
  type: types.UTBETALINGER_RESET
})
