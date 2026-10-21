import * as types from 'src/constants/actionTypes'
import { ActionWithPayload } from '@navikt/fetch'
import { AnyAction } from 'redux'
import { YtelserPerMaanedResponse } from 'src/declarations/p12000'

export interface YtelserPerMaanedState {
  ytelserPerMaaned: YtelserPerMaanedResponse | null | undefined
  gettingYtelserPerMaaned: boolean
}

export const initialYtelserPerMaanedState: YtelserPerMaanedState = {
  ytelserPerMaaned: undefined,
  gettingYtelserPerMaaned: false
}

const ytelserPerMaanedReducer = (state: YtelserPerMaanedState = initialYtelserPerMaanedState, action: AnyAction): YtelserPerMaanedState => {
  switch (action.type) {
    case types.YTELSER_PER_MAANED_REQUEST:
      return { ytelserPerMaaned: undefined, gettingYtelserPerMaaned: true }

    case types.YTELSER_PER_MAANED_SUCCESS:
      return { ytelserPerMaaned: (action as ActionWithPayload).payload.result ?? [], gettingYtelserPerMaaned: false }

    case types.YTELSER_PER_MAANED_FAILURE:
      return { ytelserPerMaaned: null, gettingYtelserPerMaaned: false }

    case types.YTELSER_PER_MAANED_RESET:
      return initialYtelserPerMaanedState

    default:
      return state
  }
}

export default ytelserPerMaanedReducer
