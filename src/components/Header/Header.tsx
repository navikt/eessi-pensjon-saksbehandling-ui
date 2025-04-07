import {MenuGridIcon, ExternalLinkIcon} from '@navikt/aksel-icons'
import { useTranslation } from 'react-i18next'
import {ActionMenu, Spacer, InternalHeader} from '@navikt/ds-react'
import {GJENNY} from "src/constants/constants";

export interface HeaderProps {
  children?: JSX.Element | Array<JSX.Element | null>
  gettingUserInfo?: boolean
  header?: JSX.Element | string
  username?: string
  indexType?: string
}

const Header: React.FC<HeaderProps> = ({
  gettingUserInfo, username, indexType = "PESYS"
}: HeaderProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <InternalHeader>
      <InternalHeader.Title as="h1">
        {indexType === GJENNY ? t('ui:app-headerTitle-gjenny') : t('ui:app-headerTitle')}
      </InternalHeader.Title>
      <Spacer />
      <ActionMenu>
        <ActionMenu.Trigger>
          <InternalHeader.Button>
            <MenuGridIcon
              style={{fontSize: "1.5rem"}}
              title={t('ui:app-header-menu-label')}
            />
          </InternalHeader.Button>
        </ActionMenu.Trigger>
        <ActionMenu.Content>
          <ActionMenu.Group label={t('ui:app-header-menu-label')}>
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
