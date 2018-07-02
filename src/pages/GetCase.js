import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Input } from 'nav-frontend-skjema';
import KnappBase from 'nav-frontend-knapper';
import AlertStripe from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Ikon from 'nav-frontend-ikoner-assets';

import Main from '../components/Main';
import * as usercaseActions from '../actions/usercase';

const mapStateToProps = (state) => {
  return {
    error        : state.usercase.error,
    usercase     : state.usercase.usercase,
    loading      : state.loading,
    serverError  : state.ui.serverError,
    language     : state.ui.language
  }
};

const mapDispatchToProps = (dispatch) => {
  return {actions: bindActionCreators(Object.assign({}, usercaseActions), dispatch)};
};

const styles = {
  hr: {
    width       : '10%',
    borderColor : 'orange'
  }
}

class GetCase extends Component {

  constructor(props) {

    super(props);
    this.state = {};
  }

  onCaseIdChange (e) {

    this.setState({caseId: e.target.value});
  }

  onCaseHandlerChange (e) {

    this.setState({caseHandler: e.target.value});
  }

  onButtonClick() {

    const {actions} = this.props;
    actions.getCaseFromCaseNumber(this.state);
  }

  componentWillReceiveProps(nextProps) {

    const { history } = this.props;
    if (nextProps.usercase && nextProps.usercase.hasOwnProperty('caseId')) {
      history.push('/case/' + nextProps.usercase.caseId);
    }
  }

  render() {

    const { t, error, serverError, loading } = this.props;

    let alert = (error ? <AlertStripe type='stopp'>{t(error)}</AlertStripe> : (
      serverError ? <AlertStripe type='stopp'>{t(serverError)}</AlertStripe> : null
    ));
    let loadingSpinner = (loading && loading['case'] ? <NavFrontendSpinner /> : null);

    return <Main>
      <div className='text-center'>
        <Ikon kind='info-sirkel-orange'/>
        <h4>Undertittel</h4>
        <hr style={styles.hr}/>
      </div>
      <div>
        <div>{alert}</div>
        <div>{loadingSpinner}</div>
      </div>
      <div className='mt-3'>
        <Input label={t('caseId')} value={this.state.caseId} onChange={this.onCaseIdChange.bind(this)}/>
      </div>
      <div className='mt-3'>
        <Input label={t('caseHandler')} value={this.state.caseHandler} onChange={this.onCaseHandlerChange.bind(this)}/>
      </div>
      <div className='mt-3'>
        <KnappBase type='hoved' onClick={this.onButtonClick.bind(this)}>{t('søk')}</KnappBase>
      </div>
    </Main>
  }
}

GetCase.propTypes = {
  usercase     : PropTypes.object,
  error        : PropTypes.object,
  serverError  : PropTypes.object,
  loading      : PropTypes.object,
  actions      : PropTypes.object,
  history      : PropTypes.object,
  t            : PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(GetCase)
);
