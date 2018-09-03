import * as types from '../constants/actionTypes';

let initialState =  {
    form: {
        isLoaded : false,
        step     : 0,
        maxstep  : 6,
        validationError: undefined
    }
};

export default function (state = initialState, action = {}) {

    switch (action.type) {

    case types.PINFO_EVENT_SET_PROPERTY:
        
        return {...state, form: { ...state.form, ...action.payload }};

    case types.PINFO_NEW:

        break;

    default:

        return state;

    }
}
