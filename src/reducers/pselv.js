import * as types from '../constants/actionTypes';

let initialState =  {
    step: 0,
    maxStep: 4
};

export default function (state = initialState, action = {}) {

    switch (action.type) {

    case types.PSELV_STEP_FORWARD:

        if (state.step === state.maxStep) {
            return state;
        } else {
            return Object.assign({}, state, {
                step : state.step + 1
            });
        }

    case types.PSELV_STEP_BACK:

        if (state.step === 0) {
            return state;
        } else {
            return Object.assign({}, state, {
                step : state.step - 1
            });
        }

    case types.APP_CLEAR_DATA:

        return initialState;

    default:

        return state;

    }
}
