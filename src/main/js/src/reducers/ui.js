import * as types from '../constants/actionTypes';

export default function (state = {}, action = {}) {

    switch (action.type) {

    case types.LANGUAGE_CHANGED:

        return Object.assign({}, state, {
            language : action.payload
        });

    case types.NAVIGATION_FORWARD:

        return Object.assign({}, state, {
            action : 'forward'
        });

    case types.NAVIGATION_BACK:

        return Object.assign({}, state, {
            action : 'back'
        });

    case types.USER_INFO_SUCCESS:

        return Object.assign({}, state, {
            userInfo : action.payload
        });

    default:

        return state;
    }
}
