import * as types from '../constants/actionTypes'
import { ActionWithPayload } from '@navikt/fetch'
import _ from 'lodash'
import { AnyAction } from 'redux'
import { filterAllWithNamespace } from 'src/utils/validation'

export interface ValidationState {
  status: any
}

const initialValidationState: ValidationState = {
  status: {}
}

const validationReducer = (state: ValidationState = initialValidationState, action: AnyAction): ValidationState => {
  switch (action.type) {
    case types.PSED_RESET:
      return initialValidationState

    case types.VALIDATION_RESET:
      const key: Array<string> | string | undefined = (action as ActionWithPayload).payload
      if (!key) {
        return {
          ...state,
          status: {}
        }
      }
      const newStatus = _.cloneDeep(state.status)
      filterAllWithNamespace(newStatus, key)
      return {
        ...state,
        status: newStatus
      }

    case types.VALIDATION_SET:
      return {
        ...state,
        status: (action as ActionWithPayload).payload
      }

    default:
      return state
  }
}

export default validationReducer
