import * as types from '../constants/actionTypes';
import * as urls  from '../constants/urls';
import * as api   from './api';
import i18n from '../i18n';

export function changeLanguage (language) {

    i18n.changeLanguage(language);

    return {
        type    : types.LANGUAGE_CHANGED,
        payload : language
    };
}

export function login () {

    return api.call({
        url     : urls.APP_LOGIN_URL,
        type    : {
            request : types.APP_LOGIN_REQUEST,
            success : types.APP_LOGIN_SUCCESS,
            failure : types.APP_LOGIN_FAILURE
        }
    });
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

export function setReferrer (referrer) {

    return {
        type    : types.APP_REFERRER_SET,
        payload : {
            referrer : referrer
        }
    };
}

