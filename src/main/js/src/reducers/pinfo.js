import * as types from '../constants/actionTypes';

let initialState =  {
    form: {}
};

export default function (state = initialState, action = {}) {

    switch (action.type) {

    case types.PINFO_NEW:


    default:

        return state;

    }
}
