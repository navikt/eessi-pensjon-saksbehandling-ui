import React, { Component } from 'react'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { bindActionCreators } from 'redux'

import * as statusActions from '../../../actions/status'
import { Lukknapp } from '../Nav'

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

const params = ['rinaId', 'sakId', 'aktoerId', 'vedtakId', 'kravId', 'fnr']

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
      {params.map(param => {
         return this.props[param] ? <div key={param} className='param'><span>{param + ':'}</span>{this.props[param]}
             <Lukknapp className='mini' bla={true} onClick={this.onUnsetParam.bind(this, param)}/></div> : null
      })}
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
