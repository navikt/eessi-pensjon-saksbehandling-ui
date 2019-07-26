import React, { useState } from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import classNames from 'classnames'
import * as uiActions from 'actions/ui'
import * as appActions from 'actions/app'
import { EtikettBase, Knapp, Input, Lukknapp, Select } from 'components/Nav'
import { getDisplayName } from 'utils/displayName'

import './Footer.css'

const mapStateToProps = (state) => {
  return {
    aktoerId: state.app.params.aktoerId,
    buc: state.app.params.buc,
    fnr: state.app.params.fnr,
    kravId: state.app.params.kravId,
    mottaker: state.app.params.mottaker,
    rinaId: state.app.params.rinaId,
    sakId: state.app.params.sakId,
    sed: state.app.params.sed,
    vedtakId: state.app.params.vedtakId,
    footerOpen: state.ui.footerOpen
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, appActions, uiActions), dispatch) }
}

export const Footer = (props) => {
  const params = ['buc', 'sed', 'rinaId', 'sakId', 'aktoerId', 'vedtakId', 'kravId', 'fnr', 'mottaker']
  const { actions, footerOpen } = props
  const [ paramName, setParamName ] = useState(undefined)
  const [ paramValue, setParamValue ] = useState(undefined)

  const onUnsetParam = (key) => {
    actions.unsetStatusParam(key)
  }

  const onSetParam = () => {
    actions.setStatusParam(paramName, paramValue)
    setParamName(undefined)
    setParamValue(undefined)
  }

  const onSetParamName = (e) => {
    let name = e.target ? e.target.value : e
    if (name !== '') {
      setParamName(name)
    }
  }

  const onSetParamValue = (e) => {
    let value = e.target.value
    if (value !== '') {
      setParamValue(value)
    }
  }

  const toggleFooterOpen = () => {
    actions.toggleFooterOpen()
  }

  return <footer className={classNames('c-footer', { toggled: footerOpen })}>
    <div className={classNames('contents', { fullWidth: !footerOpen })}>
      <div className={classNames({ footerButtonOpen: footerOpen, footerButtonClosed: !footerOpen })}
        onClick={toggleFooterOpen}>
        {footerOpen ? '▼' : null}
      </div>
      {footerOpen
        ? <div className='c-footer__form'>
          <Select id='c-footer__select-id' className='c-footer__select' label='' onChange={onSetParamName}>
            <option value=''>{'--'}</option>
            {params.map(param => {
              return props[param] ? null : <option key={param} value={param}>{param}</option>
            })}
          </Select>
          <Input label='' id='c-footer__input-id' className='c-footer__input' value={paramValue || ''}
            onChange={onSetParamValue} />
          <Knapp id='c-footer__add-button-id' className='c-footer__add-button' onClick={onSetParam}>&nbsp;+&nbsp;</Knapp>
        </div> : null}
    </div>
    {footerOpen ? <div className='c-footer__params'>
      {params.map(param => {
        return props[param] ? <div key={param} className='c-footer__param'>
          <EtikettBase className='c-footer__param-string' type='info'>
            <b>{param}</b> {props[param]}
          </EtikettBase>
          <Lukknapp className='c-footer__remove-button' bla onClick={() => onUnsetParam(param)} />
        </div> : null
      })}
    </div> : null}
  </footer>
}

Footer.propTypes = {
  actions: PT.object,
  aktoerId: PT.string,
  buc: PT.string,
  fnr: PT.string,
  footerOpen: PT.bool,
  kravId: PT.string,
  mottaker: PT.string,
  rinaId: PT.string,
  sakId: PT.string,
  sed: PT.string,
  vedtakId: PT.string
}

const ConnectedFooter = connect(mapStateToProps, mapDispatchToProps)(Footer)
ConnectedFooter.displayName = `Connect(${getDisplayName(Footer)})`
export default ConnectedFooter
