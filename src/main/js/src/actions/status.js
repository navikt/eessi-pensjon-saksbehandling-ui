import * as types from '../constants/actionTypes';
import * as urls  from '../constants/urls';
import * as api   from './api';

export function getStatus (rinaId) {

    return api.call({
        url  : urls.STATUS_GET_URL + '/' + rinaId,
        type : {
            request : types.STATUS_GET_REQUEST,
            success : types.STATUS_GET_SUCCESS,
            failure : types.STATUS_GET_FAILURE
        }
    });
}

