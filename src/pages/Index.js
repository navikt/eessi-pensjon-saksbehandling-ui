import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import LanguageSelector from '../components/LanguageSelector';
import Main from '../components/Main';
import * as Nav from '../components/Nav'

const mapStateToProps = (state) => {
  return {
    language : state.ui.language
  }
};

class Index extends Component {

  render() {

    const { t } = this.props;

    return <Main>
      <div>{t('content:indexDescription')}</div>
      <div className='mx-3 text-left'>
        <div className='mt-4'>
          <LanguageSelector/>
        </div>
        <div className='mt-4'>
          <Nav.Lenkepanel href="/getCase">{t('ui:createNewCase')}</Nav.Lenkepanel>
        </div>
      </div>
    </Main>
  }
}

Index.propTypes = {
  usercase     : PropTypes.object,
  error        : PropTypes.object,
  serverError  : PropTypes.object,
  actions      : PropTypes.object,
  history      : PropTypes.object,
  t            : PropTypes.func
};

export default connect(
  mapStateToProps,
  {}
)(
  translate()(Index)
);
