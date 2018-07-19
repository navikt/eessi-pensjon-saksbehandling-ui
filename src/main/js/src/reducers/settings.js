import * as types from '../constants/actionTypes';

export default function (state = {pdfsize: 100}, action = {}) {

    switch (action.type) {

    case types.SETTINGS_SET_PDF_SIZE:

        return Object.assign({}, state, {
            pdfsize : action.payload
        });

    default:

        return state;

    }
}
