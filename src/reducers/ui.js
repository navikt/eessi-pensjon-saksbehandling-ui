import * as types from '../constants/actionTypes';
import _ from 'lodash';

export default function (state = {}, action = {}) {

    switch (action.type) {

    case types.UI_MODAL_OPEN:

        return Object.assign({}, state, {
            modalOpen : true,
            modal     : action.payload
        });

    case types.UI_MODAL_CLOSE:

        return Object.assign({}, state, {
            modalOpen : false,
            modal     : undefined
        });

    case types.UI_LANGUAGE_CHANGED:

        return Object.assign({}, state, {
            language : action.payload,
            locale   : action.payload === 'nb' ? 'nb' : 'en-gb'
        });

    case types.UI_NAVIGATION_FORWARD:

        return Object.assign({}, state, {
            action : 'forward'
        });

    case types.UI_NAVIGATION_BACK:

        return Object.assign({}, state, {
            action : 'back'
        });

    case types.USER_INFO_SUCCESS:

        return Object.assign({}, state, {
            userInfo : action.payload
        });

    case types.UI_BREADCRUMBS_ADD: {

        let _breadcrumbs = _.clone(state.breadcrumbs);

        if ( _breadcrumbs[_breadcrumbs.length -1].ns === action.payload.ns) {
            _breadcrumbs.splice(_breadcrumbs.length -1, 1);
        }
        _breadcrumbs.push(action.payload);

        return Object.assign({}, state, {
            breadcrumbs : _breadcrumbs
        });
    }

    case types.UI_BREADCRUMBS_TRIM : {

        let _breadcrumbs = _.clone(state.breadcrumbs);

        let index = _.findIndex(_breadcrumbs, { url : action.payload.url});

        if (index >= 0) {
            _breadcrumbs.splice( index + 1)
        }

        return Object.assign({}, state, {
            breadcrumbs : _breadcrumbs
        });
    }

    case types.UI_BREADCRUMBS_DELETE : {

        let _breadcrumbs = _.clone(state.breadcrumbs);

        _breadcrumbs.splice( _breadcrumbs.length - 1, 1)

        return Object.assign({}, state, {
            breadcrumbs : _breadcrumbs
        });
    }

    default:

        return state;
    }
}
