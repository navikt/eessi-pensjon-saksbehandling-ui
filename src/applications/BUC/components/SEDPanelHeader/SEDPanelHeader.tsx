import { Label } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const ActionsDiv = styled.div`
  flex: 2;
  width: 100%;
`
const SedDiv = styled.div`
  flex: 4;
  width: 100%;
`
const SEDPanelHeaderDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
`
const SenderReceiverDiv = styled.div`
  flex: 3;
  width: 100%;
`

const SEDPanelHeader: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  return (
    <SEDPanelHeaderDiv data-testid='a_buc_c_SEDPanelHeader'>
      <SedDiv data-testid='a_buc_c_SEDPanelHeader--sed'>
        <Label>{t('buc:form-sed')}</Label>
      </SedDiv>
      <SenderReceiverDiv data-testid='a_buc_c_SEDPanelHeader--sender'>
        <Label>{t('buc:form-sender')}</Label>
      </SenderReceiverDiv>
      <SenderReceiverDiv data-testid='a_buc_c_SEDPanelHeader--receiver'>
        <Label>{t('buc:form-receiver')}</Label>
      </SenderReceiverDiv>
      <ActionsDiv data-testid='a_buc_c_SEDPanelHeader--actions'>
        <Label>{t('buc:form-actions')}</Label>
      </ActionsDiv>
    </SEDPanelHeaderDiv>
  )
}

SEDPanelHeader.propTypes = {}

export default SEDPanelHeader
