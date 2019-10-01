import React, { useState } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { Nav } from 'eessi-pensjon-ui'
import './Footer.css'

const Footer = ({ actions, footerOpen, params = {} }) => {
  const validParams = ['buc', 'sed', 'rinaId', 'sakId', 'aktoerId', 'avdodfnr', 'vedtakId', 'kravId', 'fnr', 'mottaker']
  const [paramName, setParamName] = useState(undefined)
  const [paramValue, setParamValue] = useState(undefined)

  const onUnsetParam = (key) => {
    actions.unsetStatusParam(key)
  }

  const onSetParam = () => {
    actions.setStatusParam(paramName, paramValue)
    setParamName(undefined)
    setParamValue(undefined)
  }

  const onSetParamName = (e) => {
    const name = e.target ? e.target.value : e
    if (name !== '') {
      setParamName(name)
    }
  }

  const onSetParamValue = (e) => {
    const value = e.target.value
    if (value !== '') {
      setParamValue(value)
    }
  }

  const toggleFooterOpen = () => {
    actions.toggleFooterOpen()
  }

  return (
    <footer className={classNames('c-footer', { toggled: footerOpen })}>
      <div className={classNames('contents', { fullWidth: !footerOpen })}>
        <div
          className={classNames({ footerButtonOpen: footerOpen, footerButtonClosed: !footerOpen })}
          onClick={toggleFooterOpen}
        >
          {footerOpen ? '▼' : null}
        </div>
        {footerOpen
          ? (
            <div className='c-footer__form'>
              <Nav.Select id='c-footer__select-id' className='c-footer__select' label='' onChange={onSetParamName}>
                <option value=''>--</option>
                {validParams.map(param => {
                  return params[param] ? null : <option key={param} value={param}>{param}</option>
                })}
              </Nav.Select>
              <Nav.Input
                label='' id='c-footer__input-id' className='c-footer__input' value={paramValue || ''}
                onChange={onSetParamValue}
              />
              <Nav.Knapp id='c-footer__add-button-id' className='c-footer__add-button' onClick={onSetParam}>&nbsp;+&nbsp;</Nav.Knapp>
            </div>
          ) : null}
      </div>
      {footerOpen ? (
        <div className='c-footer__params'>
          {validParams.map(param => {
            return params[param] ? (
              <div key={param} className='c-footer__param'>
                <Nav.EtikettBase className='c-footer__param-string' type='info'>
                  <b>{param}</b> {params[param]}
                </Nav.EtikettBase>
                <Nav.Lukknapp className='c-footer__remove-button' onClick={() => onUnsetParam(param)} />
              </div>
            ) : null
          })}
        </div>
      ) : null}
    </footer>
  )
}

Footer.propTypes = {
  actions: PT.object.isRequired,
  footerOpen: PT.bool,
  params: PT.object
}

export default Footer
