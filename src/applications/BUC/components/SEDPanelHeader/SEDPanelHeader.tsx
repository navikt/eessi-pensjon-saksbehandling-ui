import {Box, HGrid, Label} from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'

const SEDPanelHeader: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Box width="100%" padding="4">
      <HGrid gap="4" paddingBlock="1" align="start" columns={4} data-testid='a_buc_c_SEDPanelHeader'>
        <Label>{t('buc:form-sed')}</Label>
        <Label>{t('buc:form-sender')}</Label>
        <Label>{t('buc:form-receiver')}</Label>
        <Label>{t('buc:form-actions')}</Label>
      </HGrid>
    </Box>
  )
}

export default SEDPanelHeader
