import { setStatusParam, unsetStatusParam } from 'actions/app'
import { toggleFooterOpen } from 'actions/ui'
import BUCWebSocket from 'applications/BUC/websocket/WebSocket'
import classNames from 'classnames'
import { HighContrastKnapp } from 'components/StyledComponents'
import { Person } from 'declarations/types'
import _ from 'lodash'
import EtikettBase from 'nav-frontend-etiketter'
import Knapp from 'nav-frontend-knapper'
import Lukknapp from 'nav-frontend-lukknapp'
import { Input, Select } from 'nav-frontend-skjema'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Store } from 'redux'
import styled, { ThemeProvider } from 'styled-components'

export interface FooterProps {
  className ?: string
  highContrast: boolean
  footerOpen: boolean
  params: {[k: string]: any}
  person: Person | undefined
}

const FooterDiv = styled.footer`
  flex-shrink: 0;
  background-color: ${({ theme }: any) => theme['main-background-other-color']};
  padding: 0rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  transition: width 0.2s ease-out;
  &.toggled {
    height: 40px;
  }
  &:not(.toggled) {
    height: 10px;
  }
`
const ContentDiv = styled.div`
  display: flex;
  &.fullWidth {
    width: 100%;
  }
  .footerButtonClosed {
    width: 100%;
    margin: 0px;
    display: block;
    padding: 0px;
    background-color: lightgray;
  }
  .footerButtonClosed:hover {
    cursor: pointer;
    background-color: ${({ theme }: any) => theme['main-background-other-color']};
  }
  .footerButtonOpen {
    width: 1.2rem;
    margin-right: 0.5rem;
    display: inline-block;
    padding-top: 0.6rem;
    color: ${({ theme }: any) => theme['main-font-color']};
    text-align: center;
  }
  .footerButtonOpen:hover {
    cursor: pointer;
    background-color: ${({ theme }: any) => theme['main-background-other-color']};
  }
`
const FormDiv = styled.div`
  transform: scale(0.7);
  transform-origin: left top;
  display: flex;
  flex-direction: row;
  align-items: baseline;
`
const FooterSelect = styled(Select)`
  margin-right: 0.5rem;
  margin-bottom: 0px;
`
const FooterInput = styled(Input)`
  margin-right: 0.5rem;
  margin-bottom: 0px;
`
const AddButton = styled(Knapp)`
 padding: 0.5rem;
`

const ParamsDiv = styled.div`
  display: flex;
  flex-direction: row-reverse;

  div {
    margin-left: 0.25rem;
  }
`
const ParamDiv = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;

  .etikett {
    padding: 0.2rem !important;
    white-space: nowrap;
  }
`
const RemoveButton = styled(Lukknapp)`
  transform: scale(0.5);
`

const Footer: React.FC<FooterProps> = ({
  className, footerOpen, highContrast, params, person
}: FooterProps): JSX.Element => {
  const validParams: Array<string> = ['buc', 'sed', 'rinaId', 'sakId', 'aktoerId', 'vedtakId', 'kravId', 'fnr', 'mottaker']
  const [paramName, setParamName] = useState<string |undefined>(undefined)
  const [paramValue, setParamValue] = useState<string |undefined>(undefined)
  const store = useSelector<Store, Store>(state => state)
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

  const dumpStore = () => {
    let element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(store, null, 2)))
    element.setAttribute('download', 'store.txt')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const _toggleFooterOpen = () => {
    dispatch(toggleFooterOpen())
  }

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <FooterDiv role='contentinfo' className={classNames(className, { toggled: footerOpen })}>
        <ContentDiv className={classNames({ fullWidth: !footerOpen })}>
          <div
            className={classNames({ footerButtonOpen: footerOpen, footerButtonClosed: !footerOpen })}
            onClick={_toggleFooterOpen}
          >
            {footerOpen ? '▼' : null}
          </div>
          {footerOpen && (
            <FormDiv>
              <FooterSelect
                date-testid='c-footer__select-id'
                label=''
                onChange={onSetParamName}
              >
                <option value=''>--</option>
                {validParams.map(param => {
                  return params[param] ? null : <option key={param} value={param}>{param}</option>
                })}
              </FooterSelect>
              <FooterInput
                label=''
                date-testid='c-footer__input-id'
                value={paramValue || ''}
                onChange={onSetParamValue}
              />
              <AddButton
                data-testid='c-footer__add-button-id'
                onClick={onSetParam}
              >
                &nbsp;+&nbsp;
              </AddButton>
              <HighContrastKnapp onClick={dumpStore}>
                Dump store
              </HighContrastKnapp>
            </FormDiv>
          )}
        </ContentDiv>
        {footerOpen && (
          <ParamsDiv>
            {validParams.map(param => {
              return params[param] && (
                <ParamDiv key={param}>
                  <EtikettBase className='c-footer__param-string' type='info'>
                    <b>{param}</b> {params[param]}
                  </EtikettBase>
                  <RemoveButton
                    onClick={() => onUnsetParam(param)}
                  />
                </ParamDiv>
              )
            })}
            <BUCWebSocket
              fnr={_.get(person, 'aktoer.ident.ident')}
              avdodfnr=''
            />
          </ParamsDiv>
        )}
      </FooterDiv>
    </ThemeProvider>
  )
}

Footer.propTypes = {
  className: PT.string,
  footerOpen: PT.bool.isRequired,
  params: PT.object.isRequired
}

export default Footer
