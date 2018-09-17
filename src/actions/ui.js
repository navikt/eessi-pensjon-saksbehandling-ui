import * as types from '../constants/actionTypes';
import * as urls  from '../constants/urls';
import * as api   from './api';

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
        type    : types.UI_MODAL_OPEN,
        payload : modal
    }
}

export function closeModal () {

    return {
        type : types.UI_MODAL_CLOSE
    }
}
