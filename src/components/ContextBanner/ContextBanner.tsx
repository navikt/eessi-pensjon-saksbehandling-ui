import { getFnr } from 'applications/BUC/components/BUCUtils/BUCUtils'
import BUCWebSocket from 'applications/BUC/websocket/WebSocket'
import { HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { BUCMode, PesysContext } from 'declarations/app.d'
import { SakTypeMap, SakTypeValue } from 'declarations/buc.d'
import { PersonPDL } from 'declarations/person.d'
import { State } from 'declarations/reducers'
import { linkLogger, standardLogger } from 'metrics/loggers'
import { NextFilled, ExternalLink } from '@navikt/ds-icons'
import { Link, Detail } from '@navikt/ds-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

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
  background-color: var(--navds-semantic-color-component-background-alternate);
  border-bottom: 1px solid var(--navds-semantic-color-border);
`
export const Context = styled.div`
 padding: 0.5rem 2rem;
 display: flex;
 align-items: center;
`
export const Tag = styled(Detail)`
 padding: 0rem 0.5rem;
 margin-left: 0.25rem;
 margin-right: 0.25rem;
 display: flex;
 align-items: center;
`

export interface ContextBannerProps {
  mode: BUCMode
}

export interface ContextBannerSelector {
  gettingSakType: boolean
  personPdl: PersonPDL | undefined
  pesysContext?: PesysContext
  sakType?: SakTypeValue | undefined | null
}

const mapState = (state: State): ContextBannerSelector => ({
  gettingSakType: state.loading.gettingSakType,
  personPdl: state.person.personPdl,
  pesysContext: state.app.pesysContext,
  sakType: state.app.params.sakType as SakTypeValue | undefined | null
})

const ContextBanner: React.FC<ContextBannerProps> = ({
  mode
}: ContextBannerProps): JSX.Element => {
  const { t } = useTranslation()
  const { gettingSakType, personPdl, pesysContext, sakType }: ContextBannerSelector = useSelector<State, ContextBannerSelector>(mapState)

  useEffect(() => {
    standardLogger('context', {
      pesys: pesysContext,
      sakType
    })
  }, [])

  return (
    <Content>
      <Context>
        <BUCWebSocket
          fnr={getFnr(personPdl)}
          avdodFnr=''
        />
        <NextFilled />
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
            <WaitingPanel size='xsmall' oneLine />
          )}
          {sakType && Object.values(SakTypeMap).indexOf(sakType) >= 0 && (
            <strong>{sakType}</strong>
          )}
        </Tag>

      </Context>
      <DivWithLinks>
        <Link
          target='_blank'
          data-amplitude='links.rettskilder'
          href='https://lovdata.no/pro/#document/NAV/rundskriv/v2-45-03'
          onClick={(e: React.MouseEvent) => linkLogger(e, { mode })}
        >
          {t('ui:lawsource')}
          <HorizontalSeparatorDiv size='0.5' />
          <ExternalLink />
        </Link>
        <SeparatorSpan>
          •
        </SeparatorSpan>
        <Link
          target='_blank'
          data-amplitude='links.hjelpe'
          href='https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Pensjon-.aspx'
          onClick={(e: React.MouseEvent) => linkLogger(e, { mode })}
        >
          {t('ui:help')}
          <HorizontalSeparatorDiv size='0.5' />
          <ExternalLink />
        </Link>
      </DivWithLinks>
    </Content>
  )
}

export default ContextBanner
