import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Main.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { translate } from 'react-i18next';
import logo from '../images/logo.png';

class Main extends Component {

  render () {

    let { t } = this.props;

    return <div className='h-100'>
      <div className='row'>
        <div className='mt-3 col-12 py-3 text-center'>
          <img alt='logo' src={logo}/>
          <h1 className='mt-3 appTitle'>{t('appTitle')}</h1>
          <h5 className='mt-3 appDescription'>{t('appDescription')}</h5>
        </div>
        <div className="main col-12 h-100 py-3">
          {this.props.children}
        </div>
      </div>
    </div>
  }
}

Main.propTypes = {
  children: PropTypes.node.isRequired
};

export default translate()(Main);
