import { theme, themeHighContrast, themeKeys } from 'nav-styled-component-theme'
import React from 'react'
import { HighContrastLink } from 'components/StyledComponents'
import { useTranslation } from 'react-i18next'
import styled, { ThemeProvider } from 'styled-components'

const AlertDiv = styled.div`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }: any) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
  a {
    color: ${({ theme }: any) => theme[themeKeys.INVERTED_FONT_COLOR]} !important;
  }
  display: flex;
  justify-content: center;
 `

interface IEAlertProps {
  highContrast: boolean
}

const IEAlert: React.FC<IEAlertProps> = ({ highContrast }: IEAlertProps) => {
  // Internet Explorer 6-11
  // @ts-ignore
  const isIE = /* @cc_on!@ */false || !!document.documentMode
  // Edge 20+
  const isEdge = !isIE && !!window.StyleMedia
  const { t } = useTranslation()

  if (!isIE && !isEdge) {
    return <div />
  }

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <AlertDiv>
        <HighContrastLink
          target='_blank'
          href='https://navno.sharepoint.com/sites/fag-og-ytelser-fagsystemer/SitePages/Ta-i-bruk-PESYS-Chrome!.aspx'
        >
          {t('buc:alert-IEAlert')}
        </HighContrastLink>
      </AlertDiv>
    </ThemeProvider>
  )
}

export default IEAlert
