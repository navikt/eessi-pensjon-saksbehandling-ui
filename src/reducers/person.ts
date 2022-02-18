import * as types from 'constants/actionTypes'
import { PersonAvdods, PersonPDL } from 'declarations/person'
import { ActionWithPayload } from '@navikt/fetch'
import _ from 'lodash'
import moment from 'moment'

export interface PersonState {
  personPdl: PersonPDL | undefined
  personAvdods: PersonAvdods | undefined
  gjpbp: Date | null | undefined
  uft: Date | null | undefined
}

export const initialPersonState: PersonState = {
  personPdl: undefined,
  personAvdods: undefined,
  gjpbp: undefined,
  uft: undefined
}

const personReducer = (state: PersonState = initialPersonState, action: ActionWithPayload) => {
  switch (action.type) {
    case types.APP_CLEAR_DATA:
      return initialPersonState

    case types.PERSON_PDL_REQUEST:

      return {
        ...state,
        personPdl: undefined
      }

    case types.PERSON_PDL_FAILURE:

      return {
        ...state,
        personPdl: null
      }

    case types.PERSON_PDL_SUCCESS:

      return {
        ...state,
        personPdl: action.payload
      }

    case types.PERSON_AVDOD_REQUEST:

      return {
        ...state,
        personAvdods: undefined
      }

    case types.PERSON_AVDOD_FAILURE:

      return {
        ...state,
        personAvdods: null
      }

    case types.PERSON_AVDOD_SUCCESS:

      return {
        ...state,
        personAvdods: action.payload
      }

    case types.PERSON_GJP_BP_REQUEST:

      return {
        ...state,
        gjpbp: undefined

      }

    case types.PERSON_GJP_BP_FAILURE:

      return {
        ...state,
        gjpbp: null
      }

    case types.PERSON_GJP_BP_SUCCESS: {
      let gjpbp: Date | null |undefined = undefined
      if (!_.isEmpty((action as ActionWithPayload).payload)) {
        try {
          gjpbp = moment(_.get((action as ActionWithPayload).payload, 'doedsdato'), 'YYYY-MM-DD').toDate()
        } catch (e) {
        }
      }

      return {
        ...state,
        gjpbp: gjpbp
      }
    }

    case types.PERSON_UFT_REQUEST:

      return {
        ...state,
        uft: undefined
      }

    case types.PERSON_UFT_SUCCESS: {
      let uft
      try {
        uft = moment((action as ActionWithPayload).payload.uforetidspunkt, 'YYYY-MM-DD').toDate()
      } catch (e) {
      }

      return {
        ...state,
        uft
      }
    }

    case types.PERSON_UFT_FAILURE:
      return {
        ...state,
        uft: null
      }

    default:
      return state
  }
}

export default personReducer
