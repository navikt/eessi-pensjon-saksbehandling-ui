import * as types from '../constants/actionTypes';
import * as urls  from '../constants/urls';
import * as api   from './api';
var sprintf = require('sprintf-js').sprintf;

export function openStorageModal(options) {

    return {
        type    : types.STORAGE_MODAL_OPEN,
        payload : options
    }
}

export function closeStorageModal () {

    return {
        type : types.STORAGE_MODAL_CLOSE
    }
}

export function listStorageFiles(userId, namespace) {

    return api.call({
        url    : sprintf(urls.STORAGE_LIST_URL, {userId: userId, namespace : namespace}),
        method : 'GET',
        type   : {
            request : types.STORAGE_LIST_REQUEST,
            success : types.STORAGE_LIST_SUCCESS,
            failure : types.STORAGE_LIST_FAILURE
        }
    });
}

export function getStorageFile(userId, namespace, file) {

    return api.call({
        url    : sprintf(urls.STORAGE_GET_URL, {userId: userId, namespace : namespace, file : file}),
        method : 'GET',
        type   : {
            request : types.STORAGE_GET_REQUEST,
            success : types.STORAGE_GET_SUCCESS,
            failure : types.STORAGE_GET_FAILURE
        }
    });
}

export function postStorageFile(userId, namespace, file, payload) {

    return api.call({
        url    : sprintf(urls.STORAGE_POST_URL, {userId: userId, namespace : namespace, file : file}),
        method : 'POST',
        payload: payload,
        type   : {
            request : types.STORAGE_POST_REQUEST,
            success : types.STORAGE_POST_SUCCESS,
            failure : types.STORAGE_POST_FAILURE
        }
    });
}

export function deleteStorageFile(userId, namespace, file) {

    return api.call({
        url    : sprintf(urls.STORAGE_DELETE_URL, {userId: userId, namespace : namespace, file : file}),
        method : 'DELETE',
        type   : {
            request : types.STORAGE_DELETE_REQUEST,
            success : types.STORAGE_DELETE_SUCCESS,
            failure : types.STORAGE_DELETE_FAILURE
        }
    });
}

export function setTargetFileToDelete(file) {

    return {
        type    : types.STORAGE_TARGET_FILE_TO_DELETE_SET,
        payload : file
    };
}

export function cancelTargetFileToDelete() {

    return {
        type : types.STORAGE_TARGET_FILE_TO_DELETE_CANCEL
    };
}
