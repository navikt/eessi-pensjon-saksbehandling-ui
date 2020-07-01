import { clearData, logout } from 'actions/app'
import { toggleHighContrast } from 'actions/ui'
import * as icons from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { HorizontalSeparatorDiv } from 'components/StyledComponents'
import * as routes from 'constants/routes'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import AdvarselTrekant from 'assets/icons/advarsel-trekant'
import React from 'react'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import NavLogoTransparent from 'assets/images/NavLogoTransparent'
import Lenke from 'nav-frontend-lenker'
import { Select } from 'nav-frontend-skjema'
import Spinner from 'nav-frontend-spinner'
import { Systemtittel } from 'nav-frontend-typografi'
import styled, { ThemeProvider } from 'styled-components'

export interface HeaderProps {
  className ?: string
  children?: JSX.Element | Array<JSX.Element | null>
  gettingUserInfo?: boolean
  highContrast: boolean
  header?: JSX.Element | string
  isLoggingOut?: boolean
  username?: string
}

const HeaderDiv = styled.header`
  background-color: ${({theme}: any) => theme.navMorkGra};
  display: flex;
  flex-direction: row;
  height: 4rem;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`
const Skillelinje = styled.div`
  border-left: 1px solid ${({theme}: any) => theme.white};
  display: flex;
  height: 30px;
  width: 1px;
`
const BrandDiv = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
`

const Title = styled.div`
  color: ${({theme}: any) => theme.white};
  display: flex;
  font-size: 13pt;
  padding-left: 15px;
`

const UserDiv = styled.div`
  align-items: flex-end;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const SaksbehandlerUser = styled.div`
   color: ${({theme}: any) => theme.navRod};
`

const NameDiv = styled.div`
  margin: auto 0px;
  padding: 0.3em;
`

const NameSelect = styled(Select)`
  color: ${({theme}: any) => theme['main-font-color']};
  position: relative;
  .selectContainer:before,
  .selectContainer:after {
    background: white !important;
  }
  select {
    background: transparent !important;
  }
  select:not(:hover) {
    border-color: transparent !important;
  }
  select:hover {
    border-color: ${({theme}: any) => theme['main-font-color']} !important;
  }
  option {
    padding: 0.5rem;
  }
  .skjemaelement__input {
    color: ${({theme}: any) => theme.white};
  }
`
const Link = styled(Lenke)`
  color: ${({theme}: any) => theme.white};
`
const UsernameSpan = styled.span`
  padding: 0.45rem;
  padding-left: 0.5rem;
  padding-right: 1.6rem;
  color: ${({theme}: any) => theme['@main-font-color']}
`

const Header: React.FC<HeaderProps> = ({
  className, children, gettingUserInfo, highContrast, header,
  isLoggingOut, username
}: HeaderProps): JSX.Element => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const history = useHistory()

  const onLogoClick = () => {
    dispatch(clearData())
    history.push({
      pathname: routes.ROOT,
      search: window.location.search
    })
  }

  const onHighContrastClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleHighContrast())
  }

  const handleUsernameSelectRequest = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'logout') {
      dispatch(clearData())
      dispatch(logout())
    }
  }

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast: theme}>
      <HeaderDiv role='banner' className={className}>
        <BrandDiv>
          <a
          href='#index'
          data-testId='c-topHeader__logo-link'
          onClick={onLogoClick}
          >
            <NavLogoTransparent width='100' height='45' color='white' />
          </a>
          <Skillelinje />
          <Title>
            <span>{t('app-headerTitle')}</span>
          </Title>
        </BrandDiv>
        <Link
          id='c-topHeader__highcontrast-link-id'
          href='#highContrast'
          onClick={onHighContrastClick}
        >
          {t('ui:highContrast')}
        </Link>
        <UserDiv>
          {isLoggingOut
            ? <Spinner type='XS' />
            : (
              <>
              <SaksbehandlerUser>
                <FontAwesomeIcon icon={icons.faUser} />
              </SaksbehandlerUser>
              <HorizontalSeparatorDiv/>
              </>
            )}
          <Skillelinje />
          <NameDiv>
            {gettingUserInfo ? t('buc:loading-gettingUserInfo')
              : username
                ? (
                  <NameSelect
                    data-testId='username-select-id'
                    label=''
                    value={username}
                    selected={username}
                    onChange={handleUsernameSelectRequest}
                  >
                    <option value=''>{username}</option>
                    <option value='feedback'>{t('ui:giveFeedback')}</option>
                    <option value='logout'>{t('logout')}</option>
                  </NameSelect>
                )
                : (
                  <>
                    <AdvarselTrekant size={16} />
                    <UsernameSpan>
                      {t('unknown')}
                    </UsernameSpan>
                  </>
                )}
          </NameDiv>
        </UserDiv>
        {header && (
          _.isString(header) ? (
            <Systemtittel className='m-4'>
              {header}
            </Systemtittel>
          ) : header
          )}
        {children}
      </HeaderDiv>
    </ThemeProvider>
  )
}

Header.propTypes = {
  className: PT.string,
  gettingUserInfo: PT.bool,
  header: PT.oneOfType([PT.element, PT.string]),
  isLoggingOut: PT.bool,
  username: PT.string
}

export default Header
