import {Action} from "redux";
import * as types from "src/constants/actionTypes";
import {ActionWithPayload} from "@navikt/fetch";


export interface UmamiState {
  selectedP8000Properties: any | null | undefined
}

export const initialUmamiState: UmamiState = {
  selectedP8000Properties: undefined
}

const umamiReducer = (state: UmamiState = initialUmamiState, action: Action) => {
  switch (action.type) {
    case types.UMAMI_RESET_SELECTED_P8000_PROPERTIES: {
      return initialUmamiState
    }

    case types.UMAMI_SET_SELECTED_P8000_PROPERTIES: {
      return {
        ...state,
        selectedP8000Properties: {
          ...state.selectedP8000Properties,
          [(action as ActionWithPayload).payload.property]: (action as ActionWithPayload).payload.data
        }
      }
    }

    default:
      return state
  }
}

export default umamiReducer
