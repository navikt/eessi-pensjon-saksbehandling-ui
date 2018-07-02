import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import KnappBase from 'nav-frontend-knapper';
import AlertStripe from 'nav-frontend-alertstriper';

import Main from '../components/Main';

const mapStateToProps = (state) => {
  return {
    submitted : state.usercase.submitted,
    language  : state.ui.language
  };
};

class EndCase extends Component {

  onButtonClick() {

    const { history } = this.props;
    history.push('/getcase');
  }

  render() {

    let { t, submitted } = this.props;

    return <Main>
      <AlertStripe type='suksess'>{t('dataSubmitted')}</AlertStripe>
      {JSON.stringify(submitted)}
      <div className='mt-3'>
        <KnappBase className='mr-3' type='hoved' onClick={this.onButtonClick.bind(this)}>{t('createNew')}</KnappBase>
      </div>
    </Main>;
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
