import * as types from '../constants/actionTypes';
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
