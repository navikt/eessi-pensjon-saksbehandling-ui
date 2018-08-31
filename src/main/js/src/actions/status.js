import * as types from '../constants/actionTypes';
import * as urls  from '../constants/urls';
import * as api   from './api';
var sprintf = require('sprintf-js').sprintf;

export function getStatus (rinaId) {

    return api.call({
        url  : sprintf(urls.STATUS_GET_URL, {rinaId: rinaId}),
        type : {
            request : types.STATUS_GET_REQUEST,
            success : types.STATUS_GET_SUCCESS,
            failure : types.STATUS_GET_FAILURE
        }
    });
}

