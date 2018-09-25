import * as types from '../constants/actionTypes';
import * as urls  from '../constants/urls';
import * as api   from './api';

export function getUserInfo () {

    return api.call({
        url  : urls.APP_GET_USERINFO_URL,
        type : {
            request : types.APP_USERINFO_REQUEST,
            success : types.APP_USERINFO_SUCCESS,
            failure : types.APP_USERINFO_FAILURE
        }
    });
}

export function clearData() {

    return {
        type : types.APP_CLEAR_DATA
    };
}

export function setReferrer (referrer) {

    return {
        type    : types.APP_REFERRER_SET,
        payload : {
            referrer : referrer
        }
    };
}

