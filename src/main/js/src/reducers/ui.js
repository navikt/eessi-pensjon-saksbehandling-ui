import * as types from '../constants/actionTypes';

export default function (state = {}, action = {}) {

    switch (action.type) {

    case types.LANGUAGE_CHANGED:

        return Object.assign({}, state, {
            language : action.payload
        });

    default:

        return state;
    }
}
