import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import KnappBase from 'nav-frontend-knapper';
import Ikon from 'nav-frontend-ikoner-assets';

import LanguageSelector from '../components/LanguageSelector';
import Main from '../components/Main';

const mapStateToProps = (state) => {
  return {
    language : state.ui.language
  }
};

const styles = {
  hr: {
    width: '10%',
    borderColor: 'orange'
  }
}

class Index extends Component {

  onButtonClick() {

    const { history } = this.props;
    history.push('/getcase');
  }

  render() {

    const { t } = this.props;

    return <Main>
      <div className='text-center'>
        <Ikon kind='info-sirkel-orange'/>
        <h4>{t('appUndertitle')}</h4>
        <hr style={styles.hr}/>
      </div>
      <div>{t('appIntroduction')}</div>
      <div className='mt-4'>
        <LanguageSelector/>
      </div>
      <div className='mt-4'>
        <KnappBase type='hoved' onClick={this.onButtonClick.bind(this)}>{t('appStart')}</KnappBase>
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
