import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import { Select } from 'nav-frontend-skjema';
import { translate } from 'react-i18next';

import * as languageActions from '../actions/language';

const mapStateToProps = (state) => {
  return {
    language : state.ui.language
  };
};

const mapDispatchToProps = (dispatch) => {
  return {actions: bindActionCreators(Object.assign({}, languageActions), dispatch)};
};

class LanguageSelector extends Component {

  changeLanguage(e) {

    let { actions } = this.props;
    actions.changeLanguage(e.target.value);
  }

  render () {

    let { t, language } = this.props;
    return <Select label={t('chooseLanguage')} value={language} onChange={this.changeLanguage.bind(this)}>
      <option value='en'>English</option>
      <option value='nb'>Bokmål</option>
      <option value='nn'>Nynorsk</option>
    </Select>
  }
}

LanguageSelector.propTypes = {
  language : PropTypes.obj,
  t        : PropTypes.func,
  actions  : PropTypes.obj
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(LanguageSelector)
);

