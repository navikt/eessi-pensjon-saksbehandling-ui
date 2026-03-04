import {Action} from "redux";
import * as types from "src/constants/actionTypes";
import {ActionWithPayload} from "@navikt/fetch";


export interface UmamiState {
  selectedP8000Checkboxes: any | null | undefined
}

export const initialUmamiState: UmamiState = {
  selectedP8000Checkboxes: undefined
}

const umamiReducer = (state: UmamiState = initialUmamiState, action: Action) => {
  switch (action.type) {
    case types.UMAMI_RESET_SELECTED_P8000_CHECKBOXES: {
      return initialUmamiState
    }

    case types.UMAMI_SET_SELECTED_P8000_CHECKBOXES: {
      return {
        ...state,
        selectedP8000Checkboxes: {
          ...state.selectedP8000Checkboxes,
          [(action as ActionWithPayload).payload.checkbox]: (action as ActionWithPayload).payload.data
        }
      }
    }

    default:
      return state
  }
}

export default umamiReducer
