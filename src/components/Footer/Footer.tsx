import classNames from 'classnames'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React, { useState } from 'react'
import './Footer.css'
import { ActionCreators } from 'types'

export interface FooterProps {
  actions: ActionCreators;
  className ?: string;
  footerOpen: boolean;
  params: {[k: string]: any}
}

const Footer = ({ actions, className, footerOpen, params = {} }: FooterProps) => {
  const validParams = ['buc', 'sed', 'rinaId', 'sakId', 'aktoerId', 'avdodfnr', 'vedtakId', 'kravId', 'fnr', 'mottaker']
  const [paramName, setParamName] = useState<string |undefined>(undefined)
  const [paramValue, setParamValue] = useState<string |undefined>(undefined)

  const onUnsetParam = (key: string) => {
    actions.unsetStatusParam(key)
  }

  const onSetParam = () => {
    actions.setStatusParam(paramName, paramValue)
    setParamName(undefined)
    setParamValue(undefined)
  }

  const onSetParamName = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value
    if (name !== '') {
      setParamName(name)
    }
  }

  const onSetParamValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value !== '') {
      setParamValue(value)
    }
  }

  const toggleFooterOpen = () => {
    actions.toggleFooterOpen()
  }

  return (
    <footer role='contentinfo' className={classNames('c-footer', className, { toggled: footerOpen })}>
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
              <Ui.Nav.Select id='c-footer__select-id' className='c-footer__select' label='' onChange={onSetParamName}>
                <option value=''>--</option>
                {validParams.map(param => {
                  return params[param] ? null : <option key={param} value={param}>{param}</option>
                })}
              </Ui.Nav.Select>
              <Ui.Nav.Input
                label='' id='c-footer__input-id' className='c-footer__input' value={paramValue || ''}
                onChange={onSetParamValue}
              />
              <Ui.Nav.Knapp id='c-footer__add-button-id' className='c-footer__add-button' onClick={onSetParam}>&nbsp;+&nbsp;</Ui.Nav.Knapp>
            </div>
          ) : null}
      </div>
      {footerOpen ? (
        <div className='c-footer__params'>
          {validParams.map(param => {
            return params[param] ? (
              <div key={param} className='c-footer__param'>
                <Ui.Nav.EtikettBase className='c-footer__param-string' type='info'>
                  <b>{param}</b> {params[param]}
                </Ui.Nav.EtikettBase>
                <Ui.Nav.Lukknapp className='c-footer__remove-button' onClick={() => onUnsetParam(param)} />
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
  className: PT.string,
  footerOpen: PT.bool,
  params: PT.object
}

export default Footer
