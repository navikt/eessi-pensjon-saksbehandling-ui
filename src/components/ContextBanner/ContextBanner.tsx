import WaitingPanel from 'src/components/WaitingPanel/WaitingPanel'
import { PesysContext } from 'src/declarations/app.d'
import { SakTypeMap, SakTypeValue } from 'src/declarations/buc.d'
import { PersonPDL } from 'src/declarations/person.d'
import { State } from 'src/declarations/reducers'
import { ChevronRightIcon } from '@navikt/aksel-icons'
import { HStack } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

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

const ContextBanner: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const { gettingSakType, pesysContext, sakType }: ContextBannerSelector = useSelector<State, ContextBannerSelector>(mapState)

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
          {sakType && (sakType ?? Object.values(SakTypeMap).indexOf(sakType) >= 0) && (
            <strong>{sakType}</strong>
          )}
        </Tag>
      </Context>
    </Content>
  )
}

export default ContextBanner
