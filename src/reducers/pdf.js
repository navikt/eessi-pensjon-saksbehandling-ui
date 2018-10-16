/* global Uint8Array */

import * as types from '../constants/actionTypes';
import _ from 'lodash';

let initialState =  {
    recipe: {},
    files: [],
    pageScale: 1.0,
    dndTarget: 'work',
    watermark: {},
    step : 0
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
            files  : action.payload,
            recipe : newRecipe
        });
    }

    case types.PDF_CLEAR: {

        return Object.assign({}, state, {
            files : undefined
        });
    }

    case types.PDF_GENERATE_SUCCESS: {

        const files = _.clone(action.payload);
        for (var j in files) {
            files[j].data =  Uint8Array.from(window.atob(files[j].base64), c => c.charCodeAt(0))
        }

        return Object.assign({}, state, {
            generatedPDFs : files
        });
    }

    case types.PDF_EXTERNAL_FILE_LIST_SUCCESS: {

        const extPdfs = _.clone(action.payload);
        for (var k in extPdfs) {
            extPdfs[k].data =  Uint8Array.from(window.atob(extPdfs[k].base64), c => c.charCodeAt(0))
        }

        return Object.assign({}, state, {
            extPdfs : extPdfs
        });
    }

    case types.PDF_EXTERNAL_FILE_LIST_SET : {

        return Object.assign({}, state, {
            extPdfs : action.payload
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
            pageScale : action.payload
        });

    case types.APP_CLEAR_DATA:

        return initialState;


    case types.PDF_WATERMARK_SET : {

        return Object.assign({}, state, {
            watermark : action.payload
        });
    }

    default:

        return state;
    }
}
