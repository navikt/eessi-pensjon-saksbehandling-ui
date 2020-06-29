import { setStatusParam, unsetStatusParam } from 'actions/app'
import { toggleFooterOpen } from 'actions/ui'
import classNames from 'classnames'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Input, Select } from 'nav-frontend-skjema'
import Knapp, { Hovedknapp } from 'nav-frontend-knapper'
import Lukknapp from 'nav-frontend-lukknapp'
import EtikettBase from 'nav-frontend-etiketter'
import './Footer.css'

export interface FooterProps {
  className ?: string;
  footerOpen: boolean;
  params: {[k: string]: any}
}

const Footer: React.FC<FooterProps> = ({
  className, footerOpen, params = {}
}: FooterProps): JSX.Element => {
  const validParams: Array<string> = ['buc', 'sed', 'rinaId', 'sakId', 'aktoerId', 'avdodfnr', 'vedtakId', 'kravId', 'fnr', 'mottaker']
  const [paramName, setParamName] = useState<string |undefined>(undefined)
  const [paramValue, setParamValue] = useState<string |undefined>(undefined)
  const dispatch = useDispatch()
  const onUnsetParam = (key: string) => {
    dispatch(unsetStatusParam(key))
  }

  const onSetParam = () => {
    dispatch(setStatusParam(paramName!, paramValue))
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

  const _toggleFooterOpen = () => {
    dispatch(toggleFooterOpen())
  }

  return (
    <footer role='contentinfo' className={classNames('c-footer', className, { toggled: footerOpen })}>
      <div className={classNames('contents', { fullWidth: !footerOpen })}>
        <div
          className={classNames({ footerButtonOpen: footerOpen, footerButtonClosed: !footerOpen })}
          onClick={_toggleFooterOpen}
        >
          {footerOpen ? '▼' : null}
        </div>
        {footerOpen
          ? (
            <div className='c-footer__form'>
              <Select id='c-footer__select-id' className='c-footer__select' label='' onChange={onSetParamName}>
                <option value=''>--</option>
                {validParams.map(param => {
                  return params[param] ? null : <option key={param} value={param}>{param}</option>
                })}
              </Select>
              <Input
                label='' id='c-footer__input-id' className='c-footer__input' value={paramValue || ''}
                onChange={onSetParamValue}
              />
              <Knapp id='c-footer__add-button-id' className='c-footer__add-button' onClick={onSetParam}>&nbsp;+&nbsp;</Knapp>
            </div>
          ) : null}
      </div>
      {footerOpen ? (
        <div className='c-footer__params'>
          {validParams.map(param => {
            return params[param] ? (
              <div key={param} className='c-footer__param'>
                <EtikettBase className='c-footer__param-string' type='info'>
                  <b>{param}</b> {params[param]}
                </EtikettBase>
                <Lukknapp className='c-footer__remove-button' onClick={() => onUnsetParam(param)} />
              </div>
            ) : null
          })}
          <Hovedknapp
            onClick={() => {
            (footerOpen as any)!.f.f = 2
            }}
          >Do Not Click
          </Hovedknapp>
        </div>
      ) : null}
    </footer>
  )
}

Footer.propTypes = {
  className: PT.string,
  footerOpen: PT.bool.isRequired,
  params: PT.object.isRequired
}

export default Footer
