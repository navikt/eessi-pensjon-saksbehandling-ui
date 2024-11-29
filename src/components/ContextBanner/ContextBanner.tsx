import WaitingPanel from 'src/components/WaitingPanel/WaitingPanel'
import { BUCMode, PesysContext } from 'src/declarations/app.d'
import { SakTypeMap, SakTypeValue } from 'src/declarations/buc.d'
import { PersonPDL } from 'src/declarations/person.d'
import { State } from 'src/declarations/reducers'
import { linkLogger, standardLogger } from 'src/metrics/loggers'
import { ChevronRightIcon, ExternalLinkIcon } from '@navikt/aksel-icons'
import {HStack, Link} from '@navikt/ds-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

export const DivWithLinks = styled(HStack)`
  padding: 0.5rem 2rem;
  flex-direction: row-reverse;
`
const SeparatorSpan = styled.span`
  padding: 0rem 0.5rem
`
const Content = styled(HStack)`
  align-items: center;
  justify-content: space-between;
  background-color: var(--a-surface-subtle);
  border-bottom: 1px solid var(--a-border-strong);
`
export const Context = styled(HStack)`
 padding: 0.5rem 2rem;
 align-items: center;
`
export const Tag = styled(HStack)`
 align-items: center;
 font-size: var(--a-font-size-small)
`

export const LinkContent = styled(HStack)`
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
  const { gettingSakType, pesysContext, sakType }: ContextBannerSelector = useSelector<State, ContextBannerSelector>(mapState)

  useEffect(() => {
    standardLogger('context', {
      pesys: pesysContext,
      sakType
    })
  }, [])

  return (
    <Content>
      <Context data-testid="contextbanner-context" gap="3">
        <ChevronRightIcon fontSize="1.5rem" />
        {pesysContext && (
          <Tag data-testid="tag-pesyscontext" gap="1">
            <span>{t('ui:youComeFrom')}</span>
            <strong>{(pesysContext as string).toUpperCase()}</strong>
          </Tag>
        )}
        <Tag data-testid="tag-buc-case-type" gap="1">
          {sakType && (
            <span>{t('buc:form-caseType')}: </span>
          )}
          {gettingSakType && (
            <WaitingPanel size='xsmall' oneLine />
          )}
          {sakType && Object.values(SakTypeMap).indexOf(sakType) >= 0 && (
            <strong>{sakType}</strong>
          )}
        </Tag>
      </Context>
      <DivWithLinks data-testid="div-with-links">
        <Link
          target='_blank'
          data-amplitude='links.rettskilder'
          href='https://lovdata.no/pro/#document/NAV/rundskriv/v2-45-03'
          onClick={(e: React.MouseEvent) => linkLogger(e, { mode })}
        >
          <LinkContent gap="4">
            {t('ui:lawsource')}
            <ExternalLinkIcon fontSize="1.5rem" />
          </LinkContent>
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
          <LinkContent gap="4">
            {t('ui:help')}
            <ExternalLinkIcon fontSize="1.5rem" />
          </LinkContent>
        </Link>
      </DivWithLinks>
    </Content>
  )
}

export default ContextBanner
