import * as types from '../constants/actionTypes';

export function navigateForward () {

    return {
        type : types.NAVIGATION_FORWARD
    };
}

export function navigateBack () {

    return {
        type : types.NAVIGATION_BACK
    };
}

export function openModal (modal) {

    return {
        type    : types.MODAL_OPEN,
        payload : modal
    }
}

export function closeModal () {

    return {
        type : types.MODAL_CLOSE
    }
}
