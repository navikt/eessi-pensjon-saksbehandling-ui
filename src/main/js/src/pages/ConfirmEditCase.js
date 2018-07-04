import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import * as Nav from '../components/Nav';
import TopContainer from '../components/TopContainer';

import * as usercaseActions from '../actions/usercase';

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
      history.push('/case/end');
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
      return <TopContainer/>
    }

    let alert;
    let spinner = loading && loading.postcase;
    let buttonText = spinner ? t('loading:postcase') : t('confirmAndSend');

    if (serverError) {
      alert = <Nav.AlertStripe type='stopp'>{t(serverError)}</Nav.AlertStripe>;
    }

    if (error) {
      alert = <Nav.AlertStripe type='stopp'>{t(error)}</Nav.AlertStripe>;
    }

    return <TopContainer>
      <div className='text-center'>
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
          <Nav.Knapp className='mr-4' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('tilbake')}</Nav.Knapp>
          <Nav.Hovedknapp spinner={spinner}  onClick={this.onButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
        </div>
      </div>
    </TopContainer>;
  }
}

ConfirmEditCase.propTypes = {
  actions     : PT.object.isRequired,
  history     : PT.object.isRequired,
  loading     : PT.object.isRequired,
  t           : PT.func,
  toConfirm   : PT.object,
  submitted   : PT.object,
  error       : PT.object,
  serverError : PT.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(ConfirmEditCase)
);
