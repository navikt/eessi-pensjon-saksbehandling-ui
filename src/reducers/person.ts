import * as types from 'constants/actionTypes'
import { PersonAvdods, PersonPDL } from 'declarations/person'
import { ActionWithPayload } from 'js-fetch-api'
import { initialPageNotificationState, PageNotificationState } from 'reducers/pagenotification'

export interface PersonState {
  personPdl: PersonPDL | undefined
  personAvdods: PersonAvdods | undefined
}

export const initialPersonState: PersonState = {
  personPdl: undefined,
  personAvdods: undefined
}

const personReducer = (state: PageNotificationState = initialPageNotificationState, action: ActionWithPayload) => {
  switch (action.type) {
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

    case types.PERSON_AVDOD_SUCCESS:

      return {
        ...state,
        personAvdods: action.payload
      }

    default:
      return state
  }
}

export default personReducer
