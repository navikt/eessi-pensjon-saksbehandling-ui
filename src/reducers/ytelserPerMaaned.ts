import * as types from 'src/constants/actionTypes'
import { ActionWithPayload } from '@navikt/fetch'
import { AnyAction } from 'redux'
import _ from 'lodash'
import { YtelserPerMaanedResponse } from 'src/declarations/p12000'

export interface YtelserPerMaanedState {
  // keyed by periodeId
  ytelserPerMaaned: Record<string, YtelserPerMaanedResponse | null | undefined>
  gettingYtelserPerMaaned: Record<string, boolean>
}

export const initialYtelserPerMaanedState: YtelserPerMaanedState = {
  ytelserPerMaaned: {},
  gettingYtelserPerMaaned: {}
}

const ytelserPerMaanedReducer = (state: YtelserPerMaanedState = initialYtelserPerMaanedState, action: AnyAction): YtelserPerMaanedState => {
  const periodeId: string | undefined = (action as ActionWithPayload).context?.periodeId

  switch (action.type) {
    case types.YTELSER_PER_MAANED_REQUEST:
      return {
        ytelserPerMaaned: { ...state.ytelserPerMaaned, [periodeId!]: undefined },
        gettingYtelserPerMaaned: { ...state.gettingYtelserPerMaaned, [periodeId!]: true }
      }

    case types.YTELSER_PER_MAANED_SUCCESS:
      return {
        ytelserPerMaaned: { ...state.ytelserPerMaaned, [periodeId!]: (action as ActionWithPayload).payload.result ?? [] },
        gettingYtelserPerMaaned: { ...state.gettingYtelserPerMaaned, [periodeId!]: false }
      }

    case types.YTELSER_PER_MAANED_FAILURE:
      return {
        ytelserPerMaaned: { ...state.ytelserPerMaaned, [periodeId!]: null },
        gettingYtelserPerMaaned: { ...state.gettingYtelserPerMaaned, [periodeId!]: false }
      }

    case types.YTELSER_PER_MAANED_REMOVE:
      return {
        ytelserPerMaaned: _.omit(state.ytelserPerMaaned, (action as ActionWithPayload).payload),
        gettingYtelserPerMaaned: _.omit(state.gettingYtelserPerMaaned, (action as ActionWithPayload).payload)
      }

    case types.YTELSER_PER_MAANED_RESET:
      return initialYtelserPerMaanedState

    default:
      return state
  }
}

export default ytelserPerMaanedReducer
