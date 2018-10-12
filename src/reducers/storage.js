import * as types from '../constants/actionTypes';
import _ from 'lodash';

export default function (state = {}, action = {}) {

    switch (action.type) {

    case types.UI_STORAGE_MODAL_CLOSE:

        return Object.assign({}, state, {
            fileLoaded   : undefined,
            fileList     : undefined,
            fileToDelete : undefined,
        });

    case types.STORAGE_LIST_SUCCESS: {

        return Object.assign({}, state, {
            fileList : action.payload
        });
    }

    case types.STORAGE_GET_SUCCESS: {

        let content = action.payload;

        if (_.startsWith(content, 'data:text/json;charset=utf-8,')) {
            content = content.substring('data:text/json;charset=utf-8,'.length)
            content = JSON.parse(decodeURIComponent(content));
        }

        return Object.assign({}, state, {
            fileLoaded : content
        });
    }

    case types.STORAGE_POST_SUCCESS: {

        // clean fileList so that component requests a list again
        return Object.assign({}, state, {
            fileList  : undefined
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

    default:

        return state;
    }
}
