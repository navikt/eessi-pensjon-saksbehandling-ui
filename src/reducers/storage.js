/*global Uint8Array*/

import * as types from '../constants/actionTypes';
import _ from 'lodash';

export default function (state = {}, action = {}) {

    switch (action.type) {

    case types.STORAGE_LIST_SUCCESS: {

        let parsedList = action.payload.map(file => {
            let index = file.lastIndexOf('___');
            return index >= 0 ? file.substring(index + 3) : file;
        });

        return Object.assign({}, state, {
            fileList :parsedList
        });
    }

    case types.STORAGE_GET_SUCCESS: {

        let file = action.payload;

        if (file.mimetype === 'application/pdf') {
            file.content.data = Uint8Array.from(window.atob(file.content.base64), c => c.charCodeAt(0))
        }

        return Object.assign({}, state, {
            file : file
        });
    }

    case types.STORAGE_POST_SUCCESS: {

        // clean fileList so that component requests a list again
        return Object.assign({}, state, {
            fileList : undefined
        });
    }

    case types.STORAGE_TARGET_FILE_TO_DELETE_SET : {

        return Object.assign({}, state, {
            fileToDelete : action.payload
        });
    }

    case types.STORAGE_TARGET_FILE_TO_DELETE_CANCEL : {

        return Object.assign({}, state, {
            fileToDelete : undefined
        });
    }

    case types.STORAGE_DELETE_SUCCESS: {

        let _fileList = _.clone(state.fileList);
        let fileIndex = _fileList.indexOf(state.fileToDelete);

        if (fileIndex >= 0) {
            _fileList.splice(fileIndex, 1);
        }

        return Object.assign({}, state, {
            fileList     : _fileList,
            fileToDelete : undefined
        });
    }

    case types.STORAGE_MODAL_OPEN:

        return Object.assign({}, state, {
            modalOpen    : true,
            modalOptions : action.payload
        });

    case types.STORAGE_MODAL_CLOSE:

        return Object.assign({}, state, {
            modalOpen    : false,
            modalOptions : undefined,
            file         : undefined,
            fileList     : undefined,
            fileToDelete : undefined,
        });

    default:

        return state;
    }
}
