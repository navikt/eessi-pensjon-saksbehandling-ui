import NavHighContrast, { themeKeys, HighContrastLink } from 'nav-hoykontrast'
import PT from 'prop-types'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export const AlertDiv = styled.div`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }: any) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
  a {
    color: ${({ theme }: any) => theme[themeKeys.INVERTED_FONT_COLOR]} !important;
  }
  display: flex;
  justify-content: center;
 `

export interface IEAlertProps {
  highContrast: boolean
  onLinkClick?: () => void
}

const IEAlert: React.FC<IEAlertProps> = ({ highContrast, onLinkClick = () => {} }: IEAlertProps) => {
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
    <NavHighContrast highContrast={highContrast}>
      <AlertDiv>
        <HighContrastLink
          data-test-id='c-iealert__link-id'
          href='https://navno.sharepoint.com/sites/fag-og-ytelser-fagsystemer/SitePages/Ta-i-bruk-PESYS-Chrome!.aspx'
          onClick={onLinkClick}
          target='_blank'
        >
          {t('buc:alert-IEAlert')}
        </HighContrastLink>
      </AlertDiv>
    </NavHighContrast>
  )
}

IEAlert.propTypes = {
  highContrast: PT.bool.isRequired,
  onLinkClick: PT.func
}

export default IEAlert
