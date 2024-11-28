import { HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import * as routes from 'src/constants/routes'
import PT from 'prop-types'
import { ExclamationmarkTriangleIcon, PersonSuitFillIcon } from '@navikt/aksel-icons'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import NavLogoTransparent from 'src/assets/images/NavLogoTransparent'
import { Loader, Heading } from '@navikt/ds-react'
import styled from 'styled-components'
import {GJENNY} from "src/constants/constants";

export interface HeaderProps {
  className ?: string
  children?: JSX.Element | Array<JSX.Element | null>
  gettingUserInfo?: boolean
  header?: JSX.Element | string
  isLoggingOut?: boolean
  username?: string
  indexType?: string
}

const BrandDiv = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
`
const HeaderDiv = styled.header`
  background-color: var(--a-gray-900);
  display: flex;
  flex-direction: row;
  height: 4rem;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`
const NameDiv = styled.div`
  margin: auto 0px;
  padding: 0.3em;
`
const SaksbehandlerUser = styled.div`
   color: white;
`
const Skillelinje = styled.div`
  border-left: 1px solid var(--a-white);
  display: flex;
  height: 30px;
  width: 1px;
  margin-left: 1rem;
`
const Title = styled.div`
  color: var(--a-white);
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
  color: var(--a-white) !important;
`

const Header: React.FC<HeaderProps> = ({
  className, children, gettingUserInfo, header, isLoggingOut, username, indexType = "PESYS"
}: HeaderProps): JSX.Element => {
  const { t } = useTranslation()

  const onLogoClick = () => {
    window.location.href = indexType !== GJENNY ? routes.ROOT : routes.GJENNY
  }

  return (
    <HeaderDiv role='banner' className={className}>
      <BrandDiv>
        <a
          href='#index'
          data-testid='c-header--logo-link'
          onClick={onLogoClick}
        >
          <NavLogoTransparent width='100' height='45' color='white' />
        </a>
        <Skillelinje />
        <Title>
          <span>{indexType === GJENNY ? t('ui:app-headerTitle-gjenny') : t('ui:app-headerTitle')}</span>
        </Title>
      </BrandDiv>
      <UserDiv>
        {isLoggingOut
          ? <Loader type='xsmall' />
          : (
            <>
              <SaksbehandlerUser>
                <PersonSuitFillIcon fontSize="1.5rem" />
              </SaksbehandlerUser>
              <HorizontalSeparatorDiv />
            </>
            )}
        <Skillelinje />
        <NameDiv>
          {gettingUserInfo
            ? t('message:loading-gettingUserInfo')
            : (
                username
                  ? (
                    <UsernameSpan>
                      {username}
                    </UsernameSpan>
                    )
                  : (
                    <>
                      <ExclamationmarkTriangleIcon fontSize="1.5rem" />
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
            <Heading size='medium'>
              {header}
            </Heading>
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
