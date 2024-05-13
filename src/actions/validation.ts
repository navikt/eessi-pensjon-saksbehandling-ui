import * as types from 'src/constants/actionTypes'
import { Validation} from 'src/declarations/app'
import { ActionWithPayload } from '@navikt/fetch'
import { ActionCreator } from 'redux'

export const resetValidation = (
  key?: string | Array<string> | undefined
) => ({
  type: types.VALIDATION_RESET,
  payload: key
})

export const setValidation: ActionCreator<ActionWithPayload<Validation>> = (
  newValidation: Validation
): ActionWithPayload<Validation> => ({
  type: types.VALIDATION_SET,
  payload: newValidation
})
