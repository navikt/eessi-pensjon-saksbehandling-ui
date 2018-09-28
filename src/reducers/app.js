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

    case types.APP_DROPPABLE_REGISTER : {

        let droppables = state.droppables || {};
        droppables[action.payload.id] = action.payload.ref;

        return Object.assign({}, state, {
            droppables : droppables
        });
    }

    case types.APP_DROPPABLE_UNREGISTER : {

        let droppables = state.droppables || {};
        delete droppables[action.payload.id];

        return Object.assign({}, state, {
            droppables : droppables
        });
    }

    default:
        return state;
    }
}
