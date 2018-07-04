import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import KnappBase from 'nav-frontend-knapper';
import AlertStripe from 'nav-frontend-alertstriper';
import Ikon from 'nav-frontend-ikoner-assets';

import TopContainer from '../components/TopContainer';

const mapStateToProps = (state) => {
  return {
    submitted : state.usercase.submitted,
    language  : state.ui.language
  };
};

class EndCase extends Component {

  onButtonClick() {

    const { history } = this.props;
    history.push('/case/get');
  }

  render() {

    let { t, submitted } = this.props;

    return <TopContainer>
      <div className='text-center'>
        <Ikon kind='info-sirkel-orange'/>
        <h4>{t('content:undertitle')}</h4>
        <hr/>
        <div>{t('content:endCaseDescription')}</div>
      </div>
      <div className='mx-4 text-center'>
        <div className='mt-4'>
          <AlertStripe type='suksess'>{t('dataSubmitted')}</AlertStripe>
        </div>
        <div className='mt-4'>
          {JSON.stringify(submitted)}
        </div>
        <div className='mt-4'>
          <KnappBase className='mr-3' type='hoved' onClick={this.onButtonClick.bind(this)}>{t('createNew')}</KnappBase>
        </div>
      </div>
    </TopContainer>;
  }
}

EndCase.propTypes = {
  actions   :  PropTypes.object,
  history   :  PropTypes.object,
  submitted : PropTypes.object,
  t         : PropTypes.func
};

export default connect(
  mapStateToProps,
  {}
)(
  translate()(EndCase)
);
