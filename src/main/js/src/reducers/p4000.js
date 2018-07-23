import * as types from '../constants/actionTypes';


export default function (state = {}, action = {}) {

    switch (action.type) {

        case types.P4000_ADD_TO_FORM:

            return Object.assign({}, state, {
                form : action.payload
            });

        default:
            return state;

    }
}
