import {JSX} from 'react'
import WaitingPanel from 'src/components/WaitingPanel/WaitingPanel'
import { PesysContext } from 'src/declarations/app.d'
import { SakTypeMap, SakTypeValue } from 'src/declarations/buc.d'
import { PersonPDL } from 'src/declarations/person.d'
import { State } from 'src/declarations/reducers'
import { ChevronRightIcon } from '@navikt/aksel-icons'
import { HStack } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styles from './ContextBanner.module.css'

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
    <HStack data-testid="contextbanner-context" gap="space-12" paddingInline="space-32" paddingBlock="space-8" className={styles.content}>
      <ChevronRightIcon fontSize="1.5rem" />
      {pesysContext && (
        <HStack data-testid="tag-pesyscontext" gap="space-4" align="center" className={styles.tag}>
          <span>{t('ui:youComeFrom')}</span>
          <strong>{(pesysContext as string).toUpperCase()}</strong>
        </HStack>
      )}
      <HStack data-testid="tag-buc-case-type" gap="space-4" align="center" className={styles.tag}>
        {sakType && (
          <span>{t('buc:form-caseType')}: </span>
        )}
        {gettingSakType && (
          <WaitingPanel size='xsmall' oneLine />
        )}
        {sakType && (sakType ?? Object.values(SakTypeMap).indexOf(sakType) >= 0) && (
          <strong>{sakType}</strong>
        )}
      </HStack>
    </HStack>
  );
}

export default ContextBanner
