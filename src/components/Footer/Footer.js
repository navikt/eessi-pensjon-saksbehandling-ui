import React, { Component } from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import classNames from 'classnames'

import * as uiActions from 'actions/ui'
import * as appActions from 'actions/app'
import * as Nav from 'components/Nav'
import { getDisplayName } from 'utils/displayName'

import './Footer.css'

const mapStateToProps = (state) => {
  return {
    userRole: state.app.userRole,
    rinaId: state.app.params.rinaId,
    sakId: state.app.params.sakId,
    aktoerId: state.app.params.aktoerId,
    vedtakId: state.app.params.vedtakId,
    kravId: state.app.params.kravId,
    fnr: state.app.params.fnr,
    sed: state.app.params.sed,
    buc: state.app.params.buc,
    mottaker: state.app.params.mottaker,
    footerOpen: state.ui.footerOpen
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, appActions, uiActions), dispatch) }
}

const params = ['buc', 'sed', 'rinaId', 'sakId', 'aktoerId', 'vedtakId', 'kravId', 'fnr', 'mottaker']

export class Footer extends Component {
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
      paramName: undefined,
      paramValue: undefined
    })
  }

  onSetParamName (e) {
    let name = e.target ? e.target.value : e
    if (name !== '') {
      this.setState({
        paramName: name
      })
    }
  }

  onSetParamValue (e) {
    let value = e.target.value
    this.setState({
      paramValue: value
    })
  }

  toggleFooterOpen () {
    const { actions } = this.props
    actions.toggleFooterOpen()
  }

  render () {
    const { footerOpen } = this.props
    const { paramValue } = this.state

    return <footer className={classNames('c-footer', { toggled: footerOpen })}>
      <div className={classNames('contents', { fullWidth: !footerOpen })}>
        <div className={classNames({ footerButtonOpen: footerOpen, footerButtonClosed: !footerOpen })}
          onClick={this.toggleFooterOpen.bind(this)}>
          {footerOpen ? '▼' : null}
        </div>
        {footerOpen ? <div className='newParam'>
          <Nav.Select className='paramSelect' label='' onChange={this.onSetParamName.bind(this)}>
            <option value=''>{'--'}</option>
            {params.map(param => {
              return this.props[param] ? null : <option key={param} value={param}>{param}</option>
            })}
          </Nav.Select>
          <Nav.Input label='' className={'paramValue'} value={paramValue || ''}
            onChange={this.onSetParamValue.bind(this)} />
          <Nav.Knapp className='addParamButton' onClick={this.onSetParam.bind(this)}>&nbsp;+&nbsp;</Nav.Knapp>
        </div> : null}
      </div>
      {footerOpen ? <div className='params'>
        {params.map(param => {
          return this.props[param] ? <div key={param} className='param'>
            <Nav.EtikettBase type='info'><b>{param}</b> {this.props[param]}</Nav.EtikettBase>
            <Nav.Lukknapp className='mini' bla onClick={this.onUnsetParam.bind(this, param)} /></div> : null
        })}
      </div> : null}
    </footer>
  }
}

Footer.propTypes = {
  sed: PT.string,
  buc: PT.string,
  rinaId: PT.string,
  sakId: PT.string,
  aktoerId: PT.string,
  vedtakId: PT.string,
  kravId: PT.string,
  fnr: PT.string
}

const ConnectedFooter = connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer)

ConnectedFooter.displayName = `Connect(${getDisplayName(Footer)})`

export default ConnectedFooter
