import ExternalLink from 'assets/icons/line-version-logout'
import { HorizontalSeparatorDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { linkLogger } from 'metrics/loggers'
import Lenke from 'nav-frontend-lenker'
import { EtikettLiten } from 'nav-frontend-typografi'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'

interface ContextBannerProps {
  highContrast: boolean
  mode: string
}
const DivWithLinks = styled.div`
  padding: 0.5rem 2rem;
  display: flex;
  flex-direction: row-reverse;
  *[href] {
    color: ${({ theme }: any) => theme['main-interactive-color']} !important;
  }
  * svg {
    fill: ${({ theme }: any) => theme['main-interactive-color']} !important;
    stroke: ${({ theme }: any) => theme['main-interactive-color']} !important;
  }
`
const SeparatorSpan = styled.span`
  padding: 0rem 0.5rem
`
const Link = styled(Lenke)`
  display: flex;
  align-items: flex-end;
`
const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }: any) => theme.type === 'themeHighContrast' ? 'black' : 'lightgrey'};
`
const Separator = styled.div`
  padding-bottom: 1rem;
  background-color: ${({ theme }: any) => theme['main-background-other-color']};
`
const Context = styled.div`
 padding: 0.5rem 2rem;
 display: flex;
`
const Tag = styled(EtikettLiten)`
 border: 1px solid grey;
 padding: 0rem 0.5rem;
 margin-left: 0.25rem;
 margin-right: 0.25rem;
`

interface ContextBannerSelector {
  aktoerId?: string;
  kravId?: string;
  sakType?: string;
  vedtakId?: string;
}

const mapState = (state: State): ContextBannerSelector => ({
  aktoerId: state.app.params.aktoerId,
  kravId: state.app.params.kravId,
  sakType: state.app.params.sakType,
  vedtakId: state.app.params.vedtakId
})

const ContextBanner: React.FC<ContextBannerProps> = ({
  highContrast, mode
}: ContextBannerProps): JSX.Element => {

  const linkColor = highContrast ? themeHighContrast['main-interactive-color'] : theme['main-interactive-color']
  const { t } = useTranslation()
  const { vedtakId, aktoerId, kravId, sakType }: ContextBannerSelector = useSelector<State, ContextBannerSelector>(mapState)

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <Content>
        <Context>
          {aktoerId && <Tag><strong>aktoerId</strong>: {aktoerId}</Tag>}
          {kravId && <Tag><strong>kravId</strong>: {kravId}</Tag>}
          {sakType && <Tag><strong>sakType</strong>: {sakType}</Tag>}
          {vedtakId && <Tag><strong>vedtakId</strong>: {vedtakId}</Tag>}
        </Context>
        <DivWithLinks>
          <Link
            target='_blank'
            data-amplitude='links.rettskilder'
            href='https://lovdata.no/pro/#document/NAV/rundskriv/v2-45-03'
            onClick={(e: React.MouseEvent) => linkLogger(e, { mode: mode })}
          >
            {t('ui:lawsource')}
            <HorizontalSeparatorDiv data-size='0.5' />
            <ExternalLink color={linkColor} />
          </Link>
          <SeparatorSpan>
            •
          </SeparatorSpan>
          <Link
            target='_blank'
            data-amplitude='links.hjelpe'
            href='https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Pensjon-.aspx'
            onClick={(e: React.MouseEvent) => linkLogger(e, { mode: mode })}
          >
            {t('ui:help')}
            <HorizontalSeparatorDiv data-size='0.5' />
            <ExternalLink color={linkColor} />
          </Link>
        </DivWithLinks>
      </Content>
      <Separator/>
    </ThemeProvider>
  )
}

export default ContextBanner
