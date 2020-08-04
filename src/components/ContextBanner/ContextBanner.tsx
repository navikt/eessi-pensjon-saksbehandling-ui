import { BUCMode } from 'applications/BUC'
import ExternalLink from 'assets/icons/line-version-logout'
import { HighContrastLink, HorizontalSeparatorDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Person, PesysContext } from 'declarations/types'
import BUCWebSocket from 'applications/BUC/websocket/WebSocket'
import _ from 'lodash'
import { linkLogger, standardLogger } from 'metrics/loggers'
import { HoyreChevron } from 'nav-frontend-chevron'
import { EtikettLiten } from 'nav-frontend-typografi'
import { theme, themeKeys, themeHighContrast } from 'nav-styled-component-theme'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'

const DivWithLinks = styled.div`
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
const Context = styled.div`
 padding: 0.5rem 2rem;
 display: flex;
 align-items: center;
 * {
   font-size: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
   line-height: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
 }
`
const Tag = styled(EtikettLiten)`
 padding: 0rem 0.5rem;
 margin-left: 0.25rem;
 margin-right: 0.25rem;
`

interface ContextBannerProps {
  highContrast: boolean
  mode: BUCMode
}

interface ContextBannerSelector {
  person: Person | undefined
  pesysContext?: PesysContext
  sakType?: string
}

const mapState = (state: State): ContextBannerSelector => ({
  person: state.app.person,
  pesysContext: state.app.pesysContext,
  sakType: state.app.params.sakType
})

const ContextBanner: React.FC<ContextBannerProps> = ({
  highContrast, mode
}: ContextBannerProps): JSX.Element => {
  const _theme = highContrast ? themeHighContrast : theme
  const linkColor = _theme[themeKeys.MAIN_INTERACTIVE_COLOR]
  const [mounted, setMounted] = useState<boolean>(false)
  const { t } = useTranslation()
  const { person, pesysContext, sakType }: ContextBannerSelector =
    useSelector<State, ContextBannerSelector>(mapState)

  useEffect(() => {
    if (!mounted) {
      standardLogger('context', {
        pesys: pesysContext,
        sakType: sakType
      })
      setMounted(true)
    }
  }, [mounted, pesysContext, sakType])

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
            <strong>{pesysContext}</strong>.
          </Tag>
          {sakType && (
            <Tag>
              <span>{t('buc:form-caseType')}: </span>
              <strong>{sakType}</strong>
            </Tag>
          )}
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
