import * as types from '../constants/actionTypes';

let initialState =  {
    modalOpen: false
};

export default function (state = initialState, action = {}) {

    switch (action.type) {

    case types.UI_MODAL_OPEN:

        return Object.assign({}, state, {
            modalOpen : true,
            modal     : action.payload
        });

    case types.UI_MODAL_CLOSE:

        return Object.assign({}, state, {
            modalOpen : false,
            modal     : undefined
        });

    case types.LANGUAGE_CHANGED:

        return Object.assign({}, state, {
            language : action.payload,
            locale   : action.payload === 'nb' ? 'nb' : 'en-gb'
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
