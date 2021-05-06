import { BUCMode } from 'applications/BUC'
import { getFnr } from 'applications/BUC/components/BUCUtils/BUCUtils'
import BUCWebSocket from 'applications/BUC/websocket/WebSocket'
import ExternalLink from 'assets/icons/line-version-logout'
import NavHighContrast, { HighContrastLink, HorizontalSeparatorDiv, theme, themeHighContrast, themeKeys } from 'nav-hoykontrast'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { PesysContext } from 'declarations/app.d'
import { SakTypeMap, SakTypeValue } from 'declarations/buc.d'
import { PersonPDL } from 'declarations/person.d'
import { State } from 'declarations/reducers'
import { linkLogger, standardLogger } from 'metrics/loggers'
import { HoyreChevron } from 'nav-frontend-chevron'
import { Element } from 'nav-frontend-typografi'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

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
  background-color: ${({ theme }) => theme.type === 'themeHighContrast' ? 'black' : 'white'};
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
export const Tag = styled(Element)`
 padding: 0rem 0.5rem;
 margin-left: 0.25rem;
 margin-right: 0.25rem;
 display: flex;
 align-items: center;
`

export interface ContextBannerProps {
  highContrast: boolean
  mode: BUCMode
}

export interface ContextBannerSelector {
  gettingSakType: boolean
  person: PersonPDL | undefined
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
    <NavHighContrast highContrast={highContrast}>
      <Content>
        <Context>
          <BUCWebSocket
            fnr={getFnr(person)}
            avdodFnr=''
          />
          <HoyreChevron />
          {pesysContext && (
            <Tag>
              <span>{t('ui:youComeFrom')}</span>
              <HorizontalSeparatorDiv size='0.25' />
              <strong>{pesysContext}</strong>.
            </Tag>
          )}
          <Tag>
            {sakType && (
              <>
                <span>{t('buc:form-caseType')}: </span>
                <HorizontalSeparatorDiv size='0.25' />
              </>
            )}
            {gettingSakType && (
              <WaitingPanel size='S' oneLine />
            )}
            {sakType && Object.values(SakTypeMap).indexOf(sakType) >= 0 && (
              <strong>{sakType}</strong>
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
            <HorizontalSeparatorDiv size='0.5' />
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
            <HorizontalSeparatorDiv size='0.5' />
            <ExternalLink color={linkColor} />
          </HighContrastLink>
        </DivWithLinks>
      </Content>
    </NavHighContrast>
  )
}

export default ContextBanner
