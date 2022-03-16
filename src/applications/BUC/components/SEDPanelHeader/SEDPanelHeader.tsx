import { Label } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

export const ActionsDiv = styled.div`
  flex: 2;
  width: 100%;
`
export const SedDiv = styled.div`
  flex: 4;
  width: 100%;
`
export const SEDPanelHeaderDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
`
export const SenderReceiverDiv = styled.div`
  flex: 3;
  width: 100%;
`

const SEDPanelHeader: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  return (
    <SEDPanelHeaderDiv>
      <SedDiv>
        <Label>{t('buc:form-sed')}</Label>
      </SedDiv>
      <SenderReceiverDiv>
        <Label>{t('buc:form-sender')}</Label>
      </SenderReceiverDiv>
      <SenderReceiverDiv>
        <Label>{t('buc:form-receiver')}</Label>
      </SenderReceiverDiv>
      <ActionsDiv>
        <Label>{t('buc:form-actions')}</Label>
      </ActionsDiv>
    </SEDPanelHeaderDiv>
  )
}

SEDPanelHeader.propTypes = {}

export default SEDPanelHeader
