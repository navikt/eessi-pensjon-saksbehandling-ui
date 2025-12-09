import {MenuGridIcon, ExternalLinkIcon, WrenchIcon} from '@navikt/aksel-icons'
import { useTranslation } from 'react-i18next'
import {ActionMenu, Spacer, InternalHeader} from '@navikt/ds-react'
import {GJENNY} from "src/constants/constants";
import {FeatureToggles} from "src/declarations/app";
import {State} from "src/declarations/reducers";
import {useSelector} from "react-redux";
import * as routes from 'src/constants/routes'
import {NavLink} from "react-router-dom";
import styles from './Header.module.css';

export interface HeaderProps {
  children?: JSX.Element | Array<JSX.Element | null>
  gettingUserInfo?: boolean
  header?: JSX.Element | string
  username?: string
  indexType?: string
}

export interface HeaderSelector {
  featureToggles: FeatureToggles
}

const mapState = (state: State): HeaderSelector => ({
  featureToggles: state.app.featureToggles,
})

const Header: React.FC<HeaderProps> = ({
  gettingUserInfo, username, indexType = "PESYS"
}: HeaderProps): JSX.Element => {
  const { featureToggles }: HeaderSelector = useSelector<State, HeaderSelector>(mapState)
  const { t } = useTranslation()

  const isAdmin: boolean = featureToggles.EESSI_ADMIN === true
  const href= indexType !== GJENNY ? routes.ROOT : routes.GJENNY

  return (
    <InternalHeader className={styles.nisseOverlay}>
      <InternalHeader.Title as={NavLink} to={href + window.location.search} reloadDocument>
        {indexType === GJENNY ? t('ui:app-headerTitle-gjenny') : t('ui:app-headerTitle')}
      </InternalHeader.Title>
      <Spacer/>
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
          <ActionMenu.Group label={t('ui:app-header-menu-label-systemer-og-oppslagsverk')}>
            <ActionMenu.Item as="a" target="_blank" href="https://lovdata.no/pro/#document/NAV/rundskriv/v2-45-03" icon={<ExternalLinkIcon aria-hidden/>}>
              {t('ui:lawsource')}
            </ActionMenu.Item>
            <ActionMenu.Item as="a" target="_blank" href="https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Pensjon-.aspx" icon={<ExternalLinkIcon aria-hidden/>}>
              {t('ui:help')}
            </ActionMenu.Item>
          </ActionMenu.Group>
          {isAdmin &&
            <>
              <ActionMenu.Divider />
              <ActionMenu.Group label={t('ui:app-header-menu-label-administrative-verktoy')}>
                <ActionMenu.Item as="a" href={"/admin" + window.location.search} icon={<WrenchIcon aria-hidden/>}>
                  {t('ui:admin-swaggerish')}
                </ActionMenu.Item>
              </ActionMenu.Group>
            </>
          }
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
