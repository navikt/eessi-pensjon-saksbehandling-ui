import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import AlertStripe from 'nav-frontend-alertstriper';
import KnappBase from 'nav-frontend-knapper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Ikon from 'nav-frontend-ikoner-assets';

import * as usercaseActions from '../actions/usercase';

import Main from '../components/Main';

const mapStateToProps = (state) => {
  return {
    toConfirm   : state.usercase.toConfirm,
    submitted   : state.usercase.submitted,
    error       : state.usercase.error,
    serverError : state.ui.serverError,
    loading     : state.loading,
    language    : state.ui.language
  };
};

const mapDispatchToProps = (dispatch) => {
  return {actions: bindActionCreators(Object.assign({}, usercaseActions), dispatch)};
};

class ConfirmEditCase extends Component {

  componentWillMount() {

    let { history, toConfirm } = this.props;

    if (!toConfirm) {
      history.push('/');
    }
  }

  componentWillReceiveProps(nextProps) {

    const { history } = this.props;
    if (nextProps.submitted) {
      history.push('/endcase');
    }
  }

  onBackButtonClick() {

    const { history, actions } = this.props;
    actions.cancelConfirmChoices();
    history.goBack();
  }

  onButtonClick() {

    const { actions, toConfirm } = this.props;
    actions.postChoices(toConfirm);
  }

  render() {

    const { t, toConfirm, error, serverError, loading } = this.props;

    if (!toConfirm) {
      return <Main/>
    }

    let alert;
    let spinner = loading && loading.postcase;
    let buttonText = spinner ? t('loading:postcase') : t('confirmAndSend');

    if (serverError) {
      alert = <AlertStripe type='stopp'>{t(serverError)}</AlertStripe>;
    }

    if (error) {
      alert = <AlertStripe type='stopp'>{t(error)}</AlertStripe>;
    }

    return <Main>
      <div className='text-center'>
        <Ikon kind='info-sirkel-orange'/>
        <h4>{t('content:undertitle')}</h4>
        <hr/>
        <div>{t('content:confirmCaseDescription')}</div>
      </div>
      <div className='mx-4 text-center'>
        <div>{alert}</div>
        <div className='mt-4 mb-4 text-left'>
          <div>{t('caseId')}: {toConfirm.caseId}</div>
          <div>{t('institution')}: {toConfirm.institution}</div>
          <div>{t('buc')}: {toConfirm.buc}</div>
          <div>{t('sed')}: {toConfirm.sed}</div>
        </div>
        <div className='mt-4'>
          <KnappBase className='mr-4' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('tilbake')}</KnappBase>
          <KnappBase spinner={spinner} type='hoved'   onClick={this.onButtonClick.bind(this)}>{buttonText}</KnappBase>
        </div>
      </div>
    </Main>;
  }
}

ConfirmEditCase.propTypes = {
  actions     : PropTypes.object,
  history     : PropTypes.object,
  loading     : PropTypes.object,
  t           : PropTypes.func,
  toConfirm   : PropTypes.object,
  submitted   : PropTypes.object,
  error       : PropTypes.object,
  serverError : PropTypes.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(ConfirmEditCase)
);
