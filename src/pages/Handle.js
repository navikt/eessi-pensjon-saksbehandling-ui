import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import AlertStripe from 'nav-frontend-alertstriper';

import Main from '../components/Main';

const mapStateToProps = (state) => {
  return {
    usercase : state.usercase.usercase,
    submitted: state.usercase.submitted,
  };
};

const mapDispatchToProps = () => {
  return {actions: {}};
};

class Handle extends Component {

  render() {
    
    let { t, submitted } = this.props;
    
    return <Main>
      <AlertStripe type='suksess'>{t('dataSubmitted')}</AlertStripe>
      {JSON.stringify(submitted)}
    </Main>;
  }
}

Handle.propTypes = {
  usercase: PropTypes.object,
  actions:  PropTypes.object,
  history:  PropTypes.object,
  submitted: PropTypes.object,
  t: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(Handle)
);
