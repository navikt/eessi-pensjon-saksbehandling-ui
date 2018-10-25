import * as types from '../constants/actionTypes'

export function stepForward () {
  return {
    type: types.PSELV_STEP_FORWARD
  }
}

export function stepBack () {
  return {
    type: types.PSELV_STEP_BACK
  }
}
