import { setStatusParam, unsetStatusParam } from 'actions/app'
import { toggleFooterOpen } from 'actions/ui'
import classNames from 'classnames'
import { themeKeys, HighContrastKnapp } from 'nav-hoykontrast'
import EtikettBase from 'nav-frontend-etiketter'
import Knapp from 'nav-frontend-knapper'
import Lukknapp from 'nav-frontend-lukknapp'
import { Input, Select } from 'nav-frontend-skjema'
import PT from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Store } from 'redux'
import styled from 'styled-components'

export const FooterDiv = styled.footer`
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.type === 'themeHighContrast' ? 'black' : 'white'};
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
    background-color: ${({ theme }) => theme.type === 'themeHighContrast' ? 'black' : 'white'};
  }
  .footerButtonClosed:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
  }
  .footerButtonOpen {
    width: 1.2rem;
    margin-right: 0.5rem;
    display: inline-block;
    padding-top: 0.6rem;
    color: ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]};
    text-align: center;
  }
  .footerButtonOpen:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
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

export interface FooterProps {
  className ?: string
  footerOpen: boolean
  params: {[k: string]: any}
}

const validParams: Array<string> = ['buc', 'sed', 'rinaId', 'sakId', 'aktoerId', 'vedtakId', 'kravId', 'fnr', 'mottaker']

const Footer: React.FC<FooterProps> = ({
  className, footerOpen, params
}: FooterProps): JSX.Element => {
  const store = useSelector<Store, Store>(state => state)
  const dispatch = useDispatch()
  const [_paramName, setParamName] = useState<string |undefined>(undefined)
  const [_paramValue, setParamValue] = useState<string |undefined>(undefined)

  const onUnsetParam = (key: string): void => {
    dispatch(unsetStatusParam(key))
  }

  const onSetParam = (): void => {
    dispatch(setStatusParam(_paramName!, _paramValue))
    setParamName(undefined)
    setParamValue(undefined)
  }

  const onSetParamName = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const name = e.target.value
    if (name !== '') {
      setParamName(name)
    }
  }

  const onSetParamValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    if (value !== '') {
      setParamValue(value)
    }
  }

  const dumpStore = (): void => {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(store, null, 2)))
    element.setAttribute('download', 'store.txt')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const onKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      dispatch(toggleFooterOpen())
    }
  }

  const _toggleFooterOpen = (): void => {
    dispatch(toggleFooterOpen())
  }

  return (
    <FooterDiv
      role='contentinfo'
      className={classNames(className, { toggled: footerOpen })}
    >
      <ContentDiv className={classNames({ fullWidth: !footerOpen })}>
        <div
          role='button'
          className={classNames({ footerButtonOpen: footerOpen, footerButtonClosed: !footerOpen })}
          onClick={_toggleFooterOpen}
          onKeyDown={onKeyDown}
          tabIndex={0}
        >
          {footerOpen ? '▼' : ''}
        </div>
        {footerOpen && (
          <FormDiv>
            <FooterSelect
              data-test-id='c-footer__select-id'
              id='c-footer__select-id'
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
              data-test-id='c-footer__input-id'
              id='c-footer__input-id'
              value={_paramValue || ''}
              onChange={onSetParamValue}
            />
            <AddButton
              data-test-id='c-footer__add-button-id'
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
                <EtikettBase
                  className='c-footer__param-string'
                  data-test-id='c-footer__param-string'
                  type='info'
                >
                  <b>{param}</b> {params[param]}
                </EtikettBase>
                <RemoveButton
                  data-test-id='c-footer__remove-button'
                  onClick={() => onUnsetParam(param)}
                />
              </ParamDiv>
            )
          })}
        </ParamsDiv>
      )}
    </FooterDiv>
  )
}

Footer.propTypes = {
  className: PT.string,
  footerOpen: PT.bool.isRequired,
  params: PT.object.isRequired
}

export default Footer
