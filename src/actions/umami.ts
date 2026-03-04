import {Action, ActionCreator} from "redux";
import {ActionWithPayload} from "@navikt/fetch";
import * as types from "src/constants/actionTypes";

export const resetSelectedP8000Checkboxes: ActionCreator<Action> = (): Action => ({
  type: types.UMAMI_RESET_SELECTED_P8000_CHECKBOXES
})

export const setSelectedP8000Checkboxes: ActionCreator<ActionWithPayload> = (
  checkbox: string, data: any
): ActionWithPayload => ({
  type: types.UMAMI_SET_SELECTED_P8000_CHECKBOXES,
  payload: { checkbox, data }
})
