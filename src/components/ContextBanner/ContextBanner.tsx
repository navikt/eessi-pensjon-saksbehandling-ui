import { BUCMode } from 'applications/BUC'
import BUCWebSocket from 'applications/BUC/websocket/WebSocket'
import ExternalLink from 'assets/icons/line-version-logout'
import { HighContrastLink, HorizontalSeparatorDiv } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { PesysContext } from 'declarations/app.d'
import { SakTypeMap, SakTypeValue } from 'declarations/buc.d'
import { Person } from 'declarations/person.d'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { linkLogger, standardLogger } from 'metrics/loggers'
import { HoyreChevron } from 'nav-frontend-chevron'
import { EtikettLiten } from 'nav-frontend-typografi'
import { theme, themeHighContrast, themeKeys } from 'nav-styled-component-theme'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'

export const DivWithLinks = styled.div`
  padding: 0.5rem 2rem;
  display: flex;
  flex-direction: row-reverse;
`
const SeparatorSpan = styled.span`
  padding: 0rem 0.5rem
`
const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.type === 'themeHighContrast' ? 'black' : 'lightgrey'};
`
export const Context = styled.div`
 padding: 0.5rem 2rem;
 display: flex;
 align-items: center;
 * {
   font-size: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
   line-height: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
 }
`
export const Tag = styled(EtikettLiten)`
 padding: 0rem 0.5rem;
 margin-left: 0.25rem;
 margin-right: 0.25rem;
 display: block;
 align-items: center;
`

export interface ContextBannerProps {
  highContrast: boolean
  mode: BUCMode
}

export interface ContextBannerSelector {
  gettingSakType: boolean
  person: Person | undefined
  pesysContext?: PesysContext
  sakType?: SakTypeValue
}

const mapState = (state: State): ContextBannerSelector => ({
  gettingSakType: state.loading.gettingSakType,
  person: state.app.person,
  pesysContext: state.app.pesysContext,
  sakType: state.app.params.sakType as SakTypeValue
})

const ContextBanner: React.FC<ContextBannerProps> = ({
  highContrast, mode
}: ContextBannerProps): JSX.Element => {
  const { t } = useTranslation()
  const { gettingSakType, person, pesysContext, sakType }: ContextBannerSelector =
    useSelector<State, ContextBannerSelector>(mapState)
  const _theme = highContrast ? themeHighContrast : theme
  const linkColor = _theme[themeKeys.MAIN_INTERACTIVE_COLOR]
  const [_mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    if (!_mounted) {
      standardLogger('context', {
        pesys: pesysContext,
        sakType: sakType
      })
      setMounted(true)
    }
  }, [_mounted, pesysContext, sakType])

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <Content>
        <Context>
          <BUCWebSocket
            fnr={_.get(person, 'aktoer.ident.ident')}
            avdodfnr=''
          />
          <HoyreChevron />
          <Tag>
            <span>{t('ui:youComeFrom')}</span>
            <HorizontalSeparatorDiv data-size='0.25'/>
            <strong>{pesysContext}</strong>.
          </Tag>
          <Tag>
            <span>{t('buc:form-caseType')}: </span>
            <HorizontalSeparatorDiv data-size='0.25'/>
            {gettingSakType && (
               <WaitingPanel size='S' oneLine />
            )}
            {sakType && (
              <strong>{Object.values(SakTypeMap).indexOf(sakType) >= 0 ? sakType : t('ui:unknown')}</strong>
            )}
          </Tag>

        </Context>
        <DivWithLinks>
          <HighContrastLink
            target='_blank'
            data-amplitude='links.rettskilder'
            href='https://lovdata.no/pro/#document/NAV/rundskriv/v2-45-03'
            onClick={(e: React.MouseEvent) => linkLogger(e, { mode: mode })}
          >
            {t('ui:lawsource')}
            <HorizontalSeparatorDiv data-size='0.5' />
            <ExternalLink color={linkColor} />
          </HighContrastLink>
          <SeparatorSpan>
            •
          </SeparatorSpan>
          <HighContrastLink
            target='_blank'
            data-amplitude='links.hjelpe'
            href='https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Pensjon-.aspx'
            onClick={(e: React.MouseEvent) => linkLogger(e, { mode: mode })}
          >
            {t('ui:help')}
            <HorizontalSeparatorDiv data-size='0.5' />
            <ExternalLink color={linkColor} />
          </HighContrastLink>
        </DivWithLinks>
      </Content>
    </ThemeProvider>
  )
}

export default ContextBanner
