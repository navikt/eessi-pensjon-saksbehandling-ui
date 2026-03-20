import {Action, ActionCreator} from "redux";
import {ActionWithPayload} from "@navikt/fetch";
import * as types from "src/constants/actionTypes";

export const resetSelectedP8000Properties: ActionCreator<Action> = (): Action => ({
  type: types.UMAMI_RESET_SELECTED_P8000_PROPERTIES
})

export const setSelectedP8000Properties: ActionCreator<ActionWithPayload> = (
  property: string, data: any
): ActionWithPayload => ({
  type: types.UMAMI_SET_SELECTED_P8000_PROPERTIES,
  payload: { property, data }
})
