import {MenuGridIcon, ExternalLinkIcon} from '@navikt/aksel-icons'
import { useTranslation } from 'react-i18next'
import NavLogoTransparent from 'src/assets/images/NavLogoTransparent'
import {ActionMenu, HStack, Spacer, InternalHeader} from '@navikt/ds-react'
import styled from 'styled-components'
import {GJENNY} from "src/constants/constants";

export const CenterHStack = styled(HStack)`
  align-items: center;
`

export interface HeaderProps {
  children?: JSX.Element | Array<JSX.Element | null>
  gettingUserInfo?: boolean
  header?: JSX.Element | string
  username?: string
  indexType?: string
}

const Title = styled.div`
  align-items: center;
  color: var(--a-white);
  display: flex;
  font-size: 13pt;
  padding-left: 15px;
`

const Header: React.FC<HeaderProps> = ({
  gettingUserInfo, username, indexType = "PESYS"
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
      <ActionMenu>
        <ActionMenu.Trigger>
          <InternalHeader.Button>
            <MenuGridIcon
              style={{fontSize: "1.5rem"}}
              title="Systemer og oppslagsverk"
            />
          </InternalHeader.Button>
        </ActionMenu.Trigger>
        <ActionMenu.Content>
          <ActionMenu.Group label="Systemer og oppslagsverk">
            <ActionMenu.Item as="a" target="_blank" href="https://lovdata.no/pro/#document/NAV/rundskriv/v2-45-03" icon={<ExternalLinkIcon aria-hidden/>}>
              {t('ui:lawsource')}
            </ActionMenu.Item>
            <ActionMenu.Item as="a" target="_blank" href="https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Pensjon-.aspx" icon={<ExternalLinkIcon aria-hidden/>}>
              {t('ui:help')}
            </ActionMenu.Item>
          </ActionMenu.Group>
        </ActionMenu.Content>
      </ActionMenu>
      <InternalHeader.User
        name={
          gettingUserInfo ?
            t('message:loading-gettingUserInfo') :
            username ?
              username :
              t('ui:unknown')
        }
      />
    </InternalHeader>
  )
}

export default Header
