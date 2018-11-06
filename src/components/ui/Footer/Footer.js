import React, { Component } from 'react'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { bindActionCreators } from 'redux'

import * as statusActions from '../../../actions/status'
import * as Nav from '../Nav'

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

  state = {}

  onUnsetParam (key) {

    const { actions } = this.props

    actions.unsetStatusParam(key)
  }

  onSetParam () {

    const { actions } = this.props
    const { paramName, paramValue } = this.state

    actions.setStatusParam(paramName, paramValue)
    this.setState({
        paramName : undefined,
        paramValue : undefined
    })
  }

  onSetParamName(e) {
     let name = e.target ? e.target.value : e
     if (name !== '') {
       this.setState({
         paramName: name
       })
     }
  }

  onSetParamValue(e) {
     let value = e.target.value
     this.setState({
       paramValue: value
     })
  }

  render () {

    const { paramValue } = this.state

    return <footer className='c-ui-footer'>
      <div className='newParam'>
        <Nav.Select className='paramSelect' label='' onChange={this.onSetParamName.bind(this)}>
          <option value=''>{'--'}</option>
          {params.map(param => {
            return this.props[param] ? null : <option key={param} value={param}>{param}</option>
          })}
        </Nav.Select>
        <Nav.Input label='' className={'paramValue'} value={paramValue || ''}
          onChange={this.onSetParamValue.bind(this)} />
        <Nav.Knapp className='addParamButton' onClick={this.onSetParam.bind(this)}>&nbsp;+&nbsp;</Nav.Knapp>
      </div>
      <div className='params'>
      {params.map(param => {
         return this.props[param] ? <div key={param} className='param'><span>{param + ':'}</span>{this.props[param]}
             <Nav.Lukknapp className='mini' bla={true} onClick={this.onUnsetParam.bind(this, param)}/></div> : null
      })}
      </div>
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
