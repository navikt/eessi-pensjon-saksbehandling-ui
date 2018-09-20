import * as types from '../constants/actionTypes';

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

