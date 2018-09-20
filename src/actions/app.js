import * as types from '../constants/actionTypes';
import * as urls  from '../constants/urls';
import * as api   from './api';
import i18n from '../i18n';

export function changeLanguage (language) {

    i18n.changeLanguage(language);

    return {
        type    : types.UI_LANGUAGE_CHANGED,
        payload : language
    };
}

export function login (options) {

    let url = urls.APP_LOGIN_URL;

    if (options.redirectTo) {
        url += '?redirectTo=' + options.redirectTo;
    }
    window.location.href = url;
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

export function clearData() {

    return {
        type : types.CLEAR_DATA
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

