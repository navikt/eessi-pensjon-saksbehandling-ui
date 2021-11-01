import * as types from 'constants/actionTypes'
import { Sed } from 'declarations/buc'
import { ActionWithPayload } from 'js-fetch-api'
import { Action } from 'redux'

export interface JournalføringState {
  seds: Array<Sed> | null | undefined
  sedSend: any | null | undefined
}

export const initialJournalføringState: JournalføringState = {
  seds: undefined,
  sedSend: undefined
}

const jurnalføringReducer = (state: JournalføringState = initialJournalføringState, action: Action | ActionWithPayload = { type: '' }) => {
  switch (action.type) {
    case types.JOURNALFØRING_SED_GET_REQUEST:
      return {
        ...state,
        seds: undefined
      }

    case types.JOURNALFØRING_SED_GET_FAILURE:
      return {
        ...state,
        seds: null
      }

    case types.JOURNALFØRING_SED_GET_SUCCESS:
      return {
        ...state,
        seds: (action as ActionWithPayload).payload
      }

    case types.JOURNALFØRING_SED_SEND_REQUEST:
      return {
        ...state,
        sedSend: undefined
      }

    case types.JOURNALFØRING_SED_SEND_FAILURE:
      return {
        ...state,
        sedSend: null
      }

    case types.JOURNALFØRING_SED_SEND_SUCCESS:
      return {
        ...state,
        sedSend: (action as ActionWithPayload).payload
      }
    default:

      return state
  }
}

export default jurnalføringReducer
