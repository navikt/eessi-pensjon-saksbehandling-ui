import * as types from 'src/constants/actionTypes'
import * as urls from 'src/constants/urls'
import { ActionWithPayload, call } from '@navikt/fetch'
import { YtelsePerMaaned, YtelserPerMaanedResponse } from 'src/declarations/p12000'
import mockYtelserPerMaaned from 'src/mocks/ytelsepermaaned/ytelsepermaaned'

// @ts-ignore
import { sprintf } from 'sprintf-js'

// Mock only: ytelser overlapping the searched period
const mockForPeriode = (fom: string, tom: string | undefined): YtelserPerMaanedResponse =>
  (mockYtelserPerMaaned as Array<YtelsePerMaaned>)
    .filter((y) => (!tom || y.fom <= tom) && (!y.tom || y.tom >= fom))

export const getYtelserPerMaaned = (
  periodeId: string,
  sakId: string,
  fom: string,
  tom: string | undefined
): ActionWithPayload<YtelserPerMaanedResponse> => {
  return call({
    url: sprintf(urls.YTELSER_PER_MAANED_URL, { sakId, fom, tom: tom ?? '' }),
    cascadeFailureError: true,
    expectedPayload: /* istanbul ignore next */ {
      result: mockForPeriode(fom, tom)
    },
    context: {
      periodeId
    },
    type: {
      request: types.YTELSER_PER_MAANED_REQUEST,
      success: types.YTELSER_PER_MAANED_SUCCESS,
      failure: types.YTELSER_PER_MAANED_FAILURE
    }
  })
}

export const removeYtelserPerMaaned = (periodeId: string): ActionWithPayload<string> => ({
  type: types.YTELSER_PER_MAANED_REMOVE,
  payload: periodeId
})

export const resetYtelserPerMaaned = () => ({
  type: types.YTELSER_PER_MAANED_RESET
})
