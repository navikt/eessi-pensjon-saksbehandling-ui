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


export function setReferrer (referrer) {

    return {
        type    : types.APP_REFERRER_SET,
        payload : {
            referrer : referrer
        }
    };
}

