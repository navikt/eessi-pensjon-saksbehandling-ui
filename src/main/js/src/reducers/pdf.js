/* global Uint8Array */

import * as types from '../constants/actionTypes';
import _ from 'lodash';

let initialState =  {
    recipe: {},
    pdfs: [],
    pdfsize: 100,
    dndTarget: 'work'
};

export default function (state = initialState, action = {}) {

    switch (action.type) {

    case types.PDF_SELECTED: {

        let newRecipe   = _.clone(state.recipe);
        let existingPDF = action.payload.map(pdf => {return pdf.name});

        for (var i in newRecipe) {
            newRecipe[i] = _.filter(newRecipe[i], (step) => {
                return existingPDF.indexOf(step.name) >= 0;
            });
        }

        return Object.assign({}, state, {
            pdfs   : action.payload,
            recipe : newRecipe
        });
    }

    case types.PDF_CLEAR: {

        return Object.assign({}, state, {
            pdfs : undefined
        });
    }

    case types.PDF_GENERATE_SUCCESS: {

        const pdfs = _.clone(action.payload);
        for (var j in pdfs) {
            pdfs[j].data =  Uint8Array.from(window.atob(pdfs[j].base64), c => c.charCodeAt(0))
        }

        return Object.assign({}, state, {
            generatedPDFs : pdfs
        });
    }

    case types.PDF_SET_RECIPE:

        return Object.assign({}, state, {
            recipe : action.payload
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
