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
    usercase     : state.usercase.usercase,
    institution  : state.usercase.institution,
    buc          : state.usercase.buc,
    sed          : state.usercase.sed,
    toConfirm    : state.usercase.toConfirm,
    error        : state.usercase.error,
    serverError  : state.ui.serverError,
    language     : state.ui.language,
    loading      : state.loading

  };
};

const mapDispatchToProps = (dispatch) => {
  return {actions: bindActionCreators(Object.assign({}, usercaseActions), dispatch)};
};

class EditCase extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sedDisabled: true
    };
  }

  componentWillMount() {

    const { actions, match, usercase, institution, buc } = this.props;

    if (_.isEmpty(usercase)) {
      let id = match.params.id;
      actions.getCaseFromCaseNumber({
        caseId: id
      });
    }

    if (_.isEmpty(institution)) {
      actions.getInstitutionOptions();
    }

    if (_.isEmpty(buc)) {
      actions.getBucOptions();
    }
  }

  componentWillReceiveProps(nextProps) {

    const { history } = this.props;

    if (nextProps.toConfirm) {
      history.push('/confirmcase');
    }
    if (nextProps.sed && !_.isEmpty(nextProps.sed)) {
      this.setState({sedDisabled: false})
    }
  }

  onBackButtonClick() {

    const { history } = this.props;
    history.goBack();
  }

  onButtonClick() {

    const { actions, usercase } = this.props;

    actions.toConfirmChoices({
      'institution' : this.state.institution,
      'buc'         : this.state.buc,
      'sed'         : this.state.sed,
      'caseId'      : usercase.caseId
    });
  }

  onInstitutionChange(e) {

    this.setState({institution: e.target.value})
  }

  onBucChange(e) {

    const { actions } = this.props;
    let buc = e.target.value;
    this.setState({buc: buc})
    actions.getSedOptions(buc);
  }

  onSedChange(e) {

    this.setState({sed: e.target.value})
  }

  renderOptions(map) {
    let options;
    if (map[0] !== '--') {
      map.unshift('--');
    }
    options = map.map(el => {
      return <option key={el}>{el}</option>
    });
    return options;
  }

  renderInstitution() {

    const { t, institution } = this.props;
    let options;

    if (institution) {
      options = this.renderOptions(institution);
    }

    return <Select label={t('institution')} value={this.state.institution} onChange={this.onInstitutionChange.bind(this)}>
      {options}
    </Select>
  }

  renderBuc() {

    const { t, buc } = this.props;
    let options;
    if (buc) {
      options = this.renderOptions(buc);
    }

    return <Select label={t('buc')} value={this.state.buc} onChange={this.onBucChange.bind(this)}>
      {options}
    </Select>
  }

  renderSed() {

    const { t, sed } = this.props;
    let options;
    if (sed) {
      options = this.renderOptions(sed);
    }

    return <Select disabled={this.state.sedDisabled} label={t('sed')} value={this.state.sed} onChange={this.onSedChange.bind(this)}>
      {options}
    </Select>
  }

  render() {

    const { t, usercase, error, serverError, loading } = this.props;

    let alert;

    if (usercase) {
      alert = <AlertStripe type='suksess'>{t('caseFound') + ': ' + usercase.caseId}</AlertStripe>;
    } else {
      alert = <AlertStripe type='stopp'>{t('caseNotFound')}</AlertStripe>;
    }

    if (serverError) {
      alert = <AlertStripe type='stopp'>{t(serverError)}</AlertStripe>;
    }

    if (error) {
      alert = <AlertStripe type='stopp'>{t(error)}</AlertStripe>;
    }

    return <Main>
      <div>{alert}</div>
      <div>
        <div className='mt-3'>{this.renderInstitution()}</div>
        <div className='float-right'>{loading && loading.institution ? <NavFrontendSpinner /> : null}</div>
      </div>
      <div>
        <div className='mt-3'>{this.renderBuc()}</div>
        <div className='float-right'>{loading && loading.buc ? <NavFrontendSpinner /> : null}</div>
      </div>
      <div>
        <div className='mt-3'>{this.renderSed()}</div>
        <div className='float-right'>{loading && loading.sed ? <NavFrontendSpinner /> : null}</div>
      </div>
      <div>
        <KnappBase className='mr-3' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('tilbake')}</KnappBase>
        <KnappBase                  type='hoved'    onClick={this.onButtonClick.bind(this)}    >{t('go')}</KnappBase>
      </div>
    </Main>;
  }
}

EditCase.propTypes = {
  usercase     : PropTypes.object,
  actions      : PropTypes.object,
  history      : PropTypes.object,
  loading      : PropTypes.object,
  t            : PropTypes.func,
  match        : PropTypes.func,
  institution  : PropTypes.object,
  sed          : PropTypes.object,
  buc          : PropTypes.object,
  toConfirm    : PropTypes.object,
  error        : PropTypes.object,
  serverError  : PropTypes.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(EditCase)
);
