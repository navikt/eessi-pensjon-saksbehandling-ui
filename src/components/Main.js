import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Main.css';

export default class Main extends Component {

  render () {

    return <div className="App">
      <header className="App-header">
        <h1 className="App-title">EESSIPEN-12</h1>
      </header>
      <div>
        {this.props.children}
      </div>
    </div>
  }
}

Main.propTypes = {
  children: PropTypes.node.isRequired
};
