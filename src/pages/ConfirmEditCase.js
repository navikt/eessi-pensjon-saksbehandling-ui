import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { translate } from 'react-i18next';

import AlertStripe from 'nav-frontend-alertstriper';
import { Select } from 'nav-frontend-skjema';
import KnappBase from 'nav-frontend-knapper';
import NavFrontendSpinner from 'nav-frontend-spinner';

import * as usercaseActions from '../actions/usercase';

import Main from '../components/Main';

const mapStateToProps = (state) => {
  return {
    toConfirm    : state.usercase.toConfirm,
    submitted    : state.usercase.submitted,
    error        : state.usercase.error,
    serverError  : state.ui.serverError,
    isProcessing : state.ui.isProcessing,
    language     : state.ui.language
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

    const { t, toConfirm, error, serverError, isProcessing } = this.props;

    let alert;
    let loading = (isProcessing ? <NavFrontendSpinner /> : null);

    if (serverError) {
      alert = <AlertStripe type='stopp'>{t(serverError)}</AlertStripe>;
    }

    if (error) {
      console.log("ERROR FOUND")
      alert = <AlertStripe type='stopp'>{t(error)}</AlertStripe>;
    }

    return <Main>
      <div>{alert}</div>
      <div className='float-right'>{loading}</div>
      <div>
        <div>{t('confirm')}</div>
        <div>{t('caseId')}: {toConfirm.caseId}</div>
        <div>{t('institution')}: {toConfirm.institution}</div>
        <div>{t('buc')}: {toConfirm.buc}</div>
        <div>{t('sed')}: {toConfirm.sed}</div>
      </div>
      <div className='mt-3'>
        <KnappBase className='mr-3' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('tilbake')}</KnappBase>
        <KnappBase                  type='hoved' onClick={this.onButtonClick.bind(this)}>{t('confirmAndSend')}</KnappBase>
      </div>
    </Main>;
  }
}

ConfirmEditCase.propTypes = {
  actions      : PropTypes.object,
  history      : PropTypes.object,
  isProcessing : PropTypes.bool,
  t            : PropTypes.func,
  toConfirm    : PropTypes.object,
  submitted    : PropTypes.object,
  error        : PropTypes.object,
  serverError  : PropTypes.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(ConfirmEditCase)
);
