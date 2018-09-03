import * as types from '../constants/actionTypes';

let initialState =  {
};

export default function (state = initialState, action = {}) {

    switch (action.type) {

    case types.STATUS_GET_SUCCESS:

        return  Object.assign({}, state, {
            status : action.payload
        });

    default:

        return state;

    }
}
