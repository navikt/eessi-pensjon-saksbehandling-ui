import * as types from 'src/constants/actionTypes'
import { ActionWithPayload } from '@navikt/fetch'
import { AnyAction } from 'redux'
import _ from 'lodash'
import { UtbetalingerResponse } from 'src/declarations/p12000'

export interface UtbetalingerState {
  // keyed by periodeId
  utbetalinger: Record<string, UtbetalingerResponse | null | undefined>
  gettingUtbetalinger: Record<string, boolean>
}

export const initialUtbetalingerState: UtbetalingerState = {
  utbetalinger: {},
  gettingUtbetalinger: {}
}

const utbetalingerReducer = (state: UtbetalingerState = initialUtbetalingerState, action: AnyAction): UtbetalingerState => {
  const periodeId: string | undefined = (action as ActionWithPayload).context?.periodeId

  switch (action.type) {
    case types.UTBETALINGER_REQUEST:
      return {
        utbetalinger: { ...state.utbetalinger, [periodeId!]: undefined },
        gettingUtbetalinger: { ...state.gettingUtbetalinger, [periodeId!]: true }
      }

    case types.UTBETALINGER_SUCCESS:
      return {
        utbetalinger: { ...state.utbetalinger, [periodeId!]: (action as ActionWithPayload).payload.result },
        gettingUtbetalinger: { ...state.gettingUtbetalinger, [periodeId!]: false }
      }

    case types.UTBETALINGER_FAILURE:
      return {
        utbetalinger: { ...state.utbetalinger, [periodeId!]: null },
        gettingUtbetalinger: { ...state.gettingUtbetalinger, [periodeId!]: false }
      }

    case types.UTBETALINGER_REMOVE:
      return {
        utbetalinger: _.omit(state.utbetalinger, (action as ActionWithPayload).payload),
        gettingUtbetalinger: _.omit(state.gettingUtbetalinger, (action as ActionWithPayload).payload)
      }

    case types.UTBETALINGER_RESET:
      return initialUtbetalingerState

    default:
      return state
  }
}

export default utbetalingerReducer
