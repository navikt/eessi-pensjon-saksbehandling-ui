import React, { Component } from 'react'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { bindActionCreators } from 'redux'

import * as statusActions from '../../../actions/status'

import './Footer.css'

const mapStateToProps = (state) => {
  return {
    rinaId: state.status.rinaId,
    sakId: state.status.sakId,
    aktoerId: state.status.aktoerId,
    vedtakId: state.status.vedtakId,
    kravId: state.status.kravId,
    fnr: state.status.fnr
  }
}

const mapDispatchToProps =  (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, statusActions), dispatch) }
}

class Footer extends Component {

  onUnsetParam (key) {

    const { actions } = this.props

    actions.unsetStatusParam(key)
  }

  render () {
    let { rinaId, sakId, aktoerId, vedtakId, kravId, fnr } = this.props

    let footerEnabled = rinaId || sakId || aktoerId || vedtakId || kravId || fnr

    if (!footerEnabled) {
      return null
    }

    return <footer className='c-ui-footer'>
      {rinaId ? <div><span>{'rinaId:'}</span>{rinaId}
      <a href='#' onClick={this.onUnsetParam.bind(this, 'rinaId')}>[X]</a></div> : null}
      {sakId ? <div><span>{'sakId:'}</span>{sakId}
      <a href='#' onClick={this.onUnsetParam.bind(this, 'sakId')}>[X]</a></div> : null}
      {aktoerId ? <div><span>{'aktoerId:'}</span>{aktoerId}
      <a href='#' onClick={this.onUnsetParam.bind(this, 'aktoerId')}>[X]</a></div> : null}
      {vedtakId ? <div><span>{'vedtakId:'}</span>{vedtakId}
      <a href='#' onClick={this.onUnsetParam.bind(this, 'vedtakId')}>[X]</a></div> : null}
      {kravId ? <div><span>{'kravId:'}</span>{kravId}
      <a href='#' onClick={this.onUnsetParam.bind(this, 'kravId')}>[X]</a></div> : null}
      {fnr ? <div><span>{'fnr:'}</span>{fnr}
      <a href='#' onClick={this.onUnsetParam.bind(this, 'fnr')}>[X]</a></div> : null}
    </footer>
  }
}

Footer.propTypes = {
  rinaId: PT.string,
  sakId: PT.string,
  aktoerId: PT.string,
  vedtakId: PT.string,
  kravId: PT.string,
  fnr: PT.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer)
