import * as types from '../constants/actionTypes';

export function setReferrer (referrer) {

    return {
        type    : types.APP_REFERRER_SET,
        payload : {
            referrer : referrer
        }
    };
}
