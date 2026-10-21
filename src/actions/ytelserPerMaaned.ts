import * as types from 'src/constants/actionTypes'
import * as urls from 'src/constants/urls'
import { ActionWithPayload, call } from '@navikt/fetch'
import { YtelsePerMaaned, YtelserPerMaanedResponse } from 'src/declarations/p12000'
import mockYtelserPerMaaned from 'src/mocks/ytelsepermaaned/ytelsepermaaned'
import _ from 'lodash'

// @ts-ignore
import { sprintf } from 'sprintf-js'

// Mock only: ytelser valid in the searched period. A ytelse is valid from its fom until the next ytelse
// starts, or until its own tom if that is earlier
const mockForPeriode = (fom: string, tom: string | undefined): YtelserPerMaanedResponse => {
  const sortert = _.sortBy(mockYtelserPerMaaned as Array<YtelsePerMaaned>, 'fom')
  return sortert.filter((y, idx) => {
    const nesteFom: string | undefined = sortert[idx + 1]?.fom
    const startetForSlutt = !tom || y.fom <= tom
    const ikkeAvsluttetForStart = (!y.tom || y.tom >= fom) && (!nesteFom || nesteFom > fom)
    return startetForSlutt && ikkeAvsluttetForStart
  })
}

export const getYtelserPerMaaned = (
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
    type: {
      request: types.YTELSER_PER_MAANED_REQUEST,
      success: types.YTELSER_PER_MAANED_SUCCESS,
      failure: types.YTELSER_PER_MAANED_FAILURE
    }
  })
}

export const resetYtelserPerMaaned = () => ({
  type: types.YTELSER_PER_MAANED_RESET
})
