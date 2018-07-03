import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Main.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { translate } from 'react-i18next';

import * as Nav from './Nav'
import TopHeader from './TopHeader';

class Main extends Component {

  render () {

    let { t } = this.props;

    return <div className='h-100'>
      <TopHeader/>
      <Nav.Container>
        <Nav.Row>
          <Nav.Column className='py-3 text-left'>
            <h1 className='mt-3 appTitle'>{t('content:pageTitle')}</h1>
          </Nav.Column>
        </Nav.Row>
        <Nav.Row>
          <Nav.Column className='py-3 text-left'>
            {this.props.children}
          </Nav.Column>
        </Nav.Row>
      </Nav.Container>
    </div>
  }
}

Main.propTypes = {
  children : PropTypes.node.isRequired,
  t        : PropTypes.func.isRequired
};

export default translate()(Main);
