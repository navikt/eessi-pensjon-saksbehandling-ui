import { clearData } from 'actions/app'
import { toggleHighContrast } from 'actions/ui'
import * as icons from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { themeKeys, HorizontalSeparatorDiv } from 'nav-hoykontrast'
import * as routes from 'constants/routes'
import PT from 'prop-types'
import { Warning } from '@navikt/ds-icons'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import NavLogoTransparent from 'assets/images/NavLogoTransparent'
import Lenke from 'nav-frontend-lenker'
import Spinner from 'nav-frontend-spinner'
import { Systemtittel } from 'nav-frontend-typografi'
import styled from 'styled-components'

export interface HeaderProps {
  className ?: string
  children?: JSX.Element | Array<JSX.Element | null>
  gettingUserInfo?: boolean
  header?: JSX.Element | string
  isLoggingOut?: boolean
  username?: string
}

const BrandDiv = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  * {
   font-size: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
   line-height: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
  }
`
const HeaderDiv = styled.header`
  background-color: ${({ theme }) => theme.navMorkGra};
  display: flex;
  flex-direction: row;
  height: 4rem;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`
const Link = styled(Lenke)`
  font-size: 1.5rem;
  color: ${({ theme }) => theme[themeKeys.WHITE]};
`
const NameDiv = styled.div`
  margin: auto 0px;
  padding: 0.3em;
`
const SaksbehandlerUser = styled.div`
   color: white;
`
const Skillelinje = styled.div`
  border-left: 1px solid ${({ theme }) => theme.white};
  display: flex;
  height: 30px;
  width: 1px;
  margin-left: 1rem;
`
const Title = styled.div`
  color: ${({ theme }) => theme.white};
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
const UsernameSpan = styled.span`
  padding: 0.45rem;
  padding-left: 0.5rem;
  padding-right: 1.6rem;
  color: ${({ theme }) => theme[themeKeys.WHITE]};
`

const Header: React.FC<HeaderProps> = ({
  className, children, gettingUserInfo, header, isLoggingOut, username
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

  return (
    <HeaderDiv role='banner' className={className}>
      <BrandDiv>
        <a
          href='#index'
          data-test-id='c-header__logo-link'
          onClick={onLogoClick}
        >
          <NavLogoTransparent width='100' height='45' color='white' />
        </a>
        <Skillelinje />
        <Title>
          <span>{t('ui:app-headerTitle')}</span>
        </Title>
      </BrandDiv>
      <Link
        data-test-id='c-header__highcontrast-link-id'
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
              <HorizontalSeparatorDiv />
            </>
            )}
        <Skillelinje />
        <NameDiv>
          {gettingUserInfo
            ? t('buc:loading-gettingUserInfo')
            : (
                username
                  ? (
                    <UsernameSpan>
                      {username}
                    </UsernameSpan>
                    )
                  : (
                    <>
                      <Warning width={20} height={20} />
                      <UsernameSpan>
                        {t('ui:unknown')}
                      </UsernameSpan>
                    </>
                    )
              )}
        </NameDiv>
      </UserDiv>
      {header && (
        _.isString(header)
          ? (
            <Systemtittel className='m-4'>
              {header}
            </Systemtittel>
            )
          : header
      )}
      {children}
    </HeaderDiv>
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
