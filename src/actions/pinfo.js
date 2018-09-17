import * as types from '../constants/actionTypes';
import * as urls  from '../constants/urls';
import * as api   from './api';

export function setEventProperty (payload) {

    return {
        type    : types.PINFO_EVENT_SET_PROPERTY,
        payload : { ...payload }
    }
}
