import * as types from '../constants/actionTypes';
import * as urls  from '../constants/urls';
import * as api   from './api';
import i18n from '../i18n';

export function changeLanguage (language) {

    i18n.changeLanguage(language);

    return {
        type    : types.UI_LANGUAGE_CHANGED,
        payload : language
    };
}

export function navigateForward () {

    return {
        type : types.UI_NAVIGATION_FORWARD
    };
}

export function navigateBack () {

    return {
        type : types.UI_NAVIGATION_BACK
    };
}

export function openModal (modal) {

    return {
        type    : types.UI_MODAL_OPEN,
        payload : modal
    }
}

export function closeModal () {

    return {
        type : types.UI_MODAL_CLOSE
    }
}

export function openFileSelectModal(options) {
    return {
        type    : types.UI_BUCKET_MODAL_OPEN,
        payload : options
    }
}

export function closeFileSelectModal () {

    return {
        type : types.UI_BUCKET_MODAL_CLOSE
    }
}

export function listBucketFiles() {

    return api.call({
        url  : urls.UI_BUCKET_FILES_LIST_URL,
        type : {
            request : types.UI_BUCKET_FILES_LIST_REQUEST,
            success : types.UI_BUCKET_FILES_LIST_SUCCESS,
            failure : types.UI_BUCKET_FILES_LIST_FAILURE
        }
    });
}

export function getBucketFile(file) {

    return api.call({
        url  : urls.UI_BUCKET_FILES_GET_URL + '/' + file.id,
        type : {
            request : types.UI_BUCKET_FILES_GET_REQUEST,
            success : types.UI_BUCKET_FILES_GET_SUCCESS,
            failure : types.UI_BUCKET_FILES_GET_FAILURE
        }
    });
}

export function addToBreadcrumbs (breadcrumbs) {

    return {
        type    : types.UI_BREADCRUMBS_ADD,
        payload : breadcrumbs
    }
}

export function trimBreadcrumbsTo (breadcrumb) {

    return {
        type    : types.UI_BREADCRUMBS_TRIM,
        payload : breadcrumb
    }
}

export function deleteLastBreadcrumb () {

    return {
        type : types.UI_BREADCRUMBS_DELETE
    }
}

export function toggleDrawerOpen () {

    return {
        type : types.UI_DRAWER_TOGGLE_OPEN
    }
}

export function toggleDrawerEnable() {

    return {
        type : types.UI_DRAWER_TOGGLE_ENABLE
    }
}

export function changeDrawerWidth(newWidth) {
    return {
        type    : types.UI_DRAWER_WIDTH_SET,
        payload : newWidth
    }
}
