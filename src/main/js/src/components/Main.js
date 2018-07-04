import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Main.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import logo from '../images/logo.png';

import LanguageSelector from './LanguageSelector';

const styles = {
  flex : {
     flex: 1
  }
}

export default class Main extends Component {

  render () {

    return <div className="h-100">
      <div className="row w-100" style={styles.flex}>
        <div className="col-12 py-3 text-center">
          <img alt='logo' src={logo}/>
          <h1 className="App-title">EESSIPEN-12</h1>
          <h5>Beskrivelse Beskrivelse Beskrivelse Beskrivelse Beskrivelse Beskrivelse Beskrivelse Beskrivelse Beskrivelse
          Beskrivelse Beskrivelse Beskrivelse Beskrivelse Beskrivelse Beskrivelse</h5>
        </div>
        <div className="main col-12 h-100 py-3">
          {this.props.children}
        </div>
      </div>
      <div className="row w-100">
        <div className="col-12 py-3">
          <LanguageSelector/>
        </div>
      </div>
    </div>
  }
}

Main.propTypes = {
  children: PropTypes.node.isRequired
};
