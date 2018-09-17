import * as types from '../constants/actionTypes';
import i18n from '../i18n';

export function changeLanguage (language) {

    i18n.changeLanguage(language);
    return {
        type    : types.LANGUAGE_CHANGED,
        payload : language
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

