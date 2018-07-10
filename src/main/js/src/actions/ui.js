import * as types from '../constants/actionTypes';

export function navigateForward () {

    return {
        type: types.NAVIGATION_FORWARD
    };
}

export function navigateBack () {

    return {
        type: types.NAVIGATION_BACK
    };
}
