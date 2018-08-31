import * as types from '../constants/actionTypes';
import * as urls  from '../constants/urls';
import * as api   from './api';

export function stepForward () {

    return {
        type: types.PSELV_STEP_FORWARD
    };
}

export function stepBack () {

    return {
        type: types.PSELV_STEP_BACK
    };
}
