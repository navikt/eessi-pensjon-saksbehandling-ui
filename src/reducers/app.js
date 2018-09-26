import * as types from '../constants/actionTypes';

let initialState =  {};

export default function (state = initialState, action = {}) {

    switch (action.type) {

    case types.APP_REFERRER_SET:

        return Object.assign({}, state, {
            referrer : action.payload.referrer
        });

    case types.APP_USERINFO_SUCCESS:

        return Object.assign({}, state, {
            userInfo : action.payload
        });

    default:
        return state;
    }
}
