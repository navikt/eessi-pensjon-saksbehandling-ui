import { Element } from 'nav-frontend-typografi'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled, { ThemeProvider } from 'styled-components'

const SEDPanelHeaderDiv = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 3px solid ${({ theme }: any) => theme.navBla};
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`
const Flex4Div = styled.div`
  flex: 4;
`
const Flex3Div = styled.div`
  flex: 3;
`
const Flex2Div = styled.div`
  flex: 2;
`
export interface SEDPanelHeaderProps {
  highContrast: boolean
}
const SEDPanelHeader: React.FC<SEDPanelHeaderProps> = ({
  highContrast
}: SEDPanelHeaderProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <SEDPanelHeaderDiv>
        <Flex4Div>
          <Element>{t('buc:form-sed')}</Element>
        </Flex4Div>
        <Flex3Div>
          <Element>{t('buc:form-sender')}</Element>
        </Flex3Div>
        <Flex3Div>
          <Element>{t('buc:form-receiver')}</Element>
        </Flex3Div>
        <Flex2Div>
          <Element>{t('buc:form-actions')}</Element>
        </Flex2Div>
      </SEDPanelHeaderDiv>
    </ThemeProvider>
  )
}

SEDPanelHeader.propTypes = {}

export default SEDPanelHeader
