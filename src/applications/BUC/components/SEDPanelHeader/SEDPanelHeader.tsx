import { Element } from 'nav-frontend-typografi'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

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
  border-bottom: 3px solid ${({ theme }) => theme.type === 'themeHighContrast' ? theme.white : theme.navBla};
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
        <Element>{t('buc:form-sed')}</Element>
      </SedDiv>
      <SenderReceiverDiv>
        <Element>{t('buc:form-sender')}</Element>
      </SenderReceiverDiv>
      <SenderReceiverDiv>
        <Element>{t('buc:form-receiver')}</Element>
      </SenderReceiverDiv>
      <ActionsDiv>
        <Element>{t('buc:form-actions')}</Element>
      </ActionsDiv>
    </SEDPanelHeaderDiv>
  )
}

SEDPanelHeader.propTypes = {}

export default SEDPanelHeader
