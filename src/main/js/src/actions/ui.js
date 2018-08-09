import * as types from '../constants/actionTypes';
import * as urls  from '../constants/urls';
import * as api   from './api';

export function navigateForward () {

    return {
        type: types.NAVIGATION_FORWARD
    };
}

export function openModal(modal) {

    return {
        type    : types.UI_MODAL_OPEN,
        payload : modal
    }
}

export function closeModal() {

    return {
        type    : types.UI_MODAL_CLOSE
    }
}

export function navigateBack () {

    return {
        type: types.NAVIGATION_BACK
    };
}

export function getUserInfo () {

    return api.call({
        url  : urls.UI_GET_USER_INFO_URL,
        type : {
            request : types.USER_INFO_REQUEST,
            success : types.USER_INFO_SUCCESS,
            failure : types.USER_INFO_FAILURE
        }
    });
}
