import * as types from '../constants/actionTypes';
import * as api from './api';

import i18n from '../i18n';

export function changeLanguage (language) {
  return (dispatch) => {
    i18n.changeLanguage(language);
    dispatch({
      type: types.LANGUAGE_CHANGED,
      payload: language
    });
  }
}
