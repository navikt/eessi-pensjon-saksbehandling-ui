import PT from 'prop-types'
import { ExclamationmarkTriangleIcon, PersonSuitFillIcon } from '@navikt/aksel-icons'
import { useTranslation } from 'react-i18next'
import NavLogoTransparent from 'src/assets/images/NavLogoTransparent'
import {Loader, HStack, Spacer, InternalHeader} from '@navikt/ds-react'
import styled from 'styled-components'
import {GJENNY} from "src/constants/constants";

export const CenterHStack = styled(HStack)`
  align-items: center;
`

export interface HeaderProps {
  className ?: string
  children?: JSX.Element | Array<JSX.Element | null>
  gettingUserInfo?: boolean
  header?: JSX.Element | string
  isLoggingOut?: boolean
  username?: string
  indexType?: string
}

const SaksbehandlerUser = styled.div`
   color: white;
`

const Title = styled.div`
  align-items: center;
  color: var(--a-white);
  display: flex;
  font-size: 13pt;
  padding-left: 15px;
`

const Header: React.FC<HeaderProps> = ({
  className, gettingUserInfo, isLoggingOut, username, indexType = "PESYS"
}: HeaderProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <InternalHeader>
      <InternalHeader.Title
      >
        <CenterHStack>
          <NavLogoTransparent width='80' height='36' color='white' />
        </CenterHStack>
      </InternalHeader.Title>
      <Title>
        <span>{indexType === GJENNY ? t('ui:app-headerTitle-gjenny') : t('ui:app-headerTitle')}</span>
      </Title>
      <Spacer />
      <InternalHeader.User
        name={
          gettingUserInfo ?
            t('message:loading-gettingUserInfo') :
            username ?
              username :
              t('ui:unknown')
        }
      />
      <CenterHStack>
        {isLoggingOut
          ? <Loader type='xsmall' />
          : (
            <>
              <SaksbehandlerUser>
                { username
                  ? <PersonSuitFillIcon fontSize="1.25rem" />
                  : <ExclamationmarkTriangleIcon fontSize="1.25rem" />
                }
              </SaksbehandlerUser>
            </>
          )
        }
      </CenterHStack>
    </InternalHeader>
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
