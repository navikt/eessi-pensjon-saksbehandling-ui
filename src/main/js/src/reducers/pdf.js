import * as types from '../constants/actionTypes';

let initialState =  {
    recipe: {},
    pdfs: [],
    pdfsize: 100,
    dndTarget: 'work'
};

export default function (state = initialState, action = {}) {

    switch (action.type) {

    case types.PDF_SELECTED: {

        return Object.assign({}, state, {
            pdfs : action.payload
        });
    }

    case types.PDF_CLEAR: {

        return Object.assign({}, state, {
            pdfs : undefined
        });
    }

    case types.PDF_GENERATE_SUCCESS:
        return Object.assign({}, state, {
            generatedPDF : action.payload.pdf
        });

    case types.PDF_SET_RECIPE:

        return Object.assign({}, state, {
            recipe : action.payload
        });

    case types.PDF_PREVIEW_START:

        return Object.assign({}, state, {
            preview : action.payload
        });

    case types.PDF_PREVIEW_END:

        return Object.assign({}, state, {
            preview : undefined
        });

    case types.PDF_SET_DND_TARGET:

        return Object.assign({}, state, {
            dndTarget : action.payload
        });

    case types.PDF_SET_PAGE_SIZE:

        return Object.assign({}, state, {
            pdfsize : action.payload
        });

    default:

        return state;
    }
}
