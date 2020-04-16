import { clearData, logout } from 'actions/app'
import { toggleHighContrast, toggleSnow } from 'actions/ui'
import classNames from 'classnames'
import * as routes from 'constants/routes'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import NavLogoTransparent from 'resources/images/NavLogoTransparent'
import './Header.css'

export interface HeaderProps {
  className ?: string;
  children?: JSX.Element | Array<JSX.Element | null>;
  gettingUserInfo?: boolean;
  header?: JSX.Element;
  isLoggingOut?: boolean;
  snow?: boolean;
  username?: string;
}

const Header: React.FC<HeaderProps> = ({
  className, children, gettingUserInfo, header,
  isLoggingOut, snow, username
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

  const onSnowClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleSnow())
  }

  const handleUsernameSelectRequest = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'logout') {
      dispatch(clearData())
      dispatch(logout())
    }
  }

  return (
    <header role='banner'>
      <div className={classNames(className, 'c-topHeader')}>
        <div className='brand'>
          <a href='#index' id='c-topHeader__logo-link' onClick={onLogoClick}>
            <NavLogoTransparent width='100' height='45' color='white' />
          </a>
          <div className='skillelinje' />
          <div className='tittel'><span>{t('app-headerTitle')}</span></div>
        </div>
        <div>
          <Ui.Nav.Lenke
            id='c-topHeader__highcontrast-link-id'
            className='c-topHeader__highcontrast-link c-topHeader__link mt-1'
            href='#highContrast'
            onClick={onHighContrastClick}
          >
            {t('ui:highContrast')}
          </Ui.Nav.Lenke>
          <Ui.Nav.Lenke
            id='c-topHeader__snow-link-id'
            className='c-topHeader__snow-link c-topHeader__link ml-4 mt-1'
            href='#snow'
            onClick={onSnowClick}
          >
            {!snow ? 'la det snø!' : 'nok med snø!'}
          </Ui.Nav.Lenke>
        </div>
        <div className='user'>
          {isLoggingOut
            ? <Ui.Nav.Spinner type='XS' />
            : (
              <div className={classNames('mr-2', 'SAKSBEHANDLER')}>
                <Ui.Icons kind='user' />
              </div>
            )}
          <div className='skillelinje' />
          <div className='mr-4 ml-2 align-middle name'>
            {gettingUserInfo ? t('buc:loading-gettingUserInfo')
              : username
                ? (
                  <Ui.Nav.Select
                    id='username-select-id'
                    className='username-select'
                    label=''
                    value={username}
                    selected={username}
                    onChange={handleUsernameSelectRequest}
                  >
                    <option value=''>{username}</option>
                    <option value='feedback'>{t('ui:giveFeedback')}</option>
                    <option value='logout'>{t('logout')}</option>
                  </Ui.Nav.Select>
                )
                : (
                  <>
                    <Ui.Icons kind='advarsel' size={16} />
                    <span className='username-span'>{t('unknown')}</span>
                  </>
                )}
          </div>
        </div>
      </div>
      {header
        ? (
          <Ui.Nav.Systemtittel className='m-4'>
            {header}
          </Ui.Nav.Systemtittel>
        )
        : null}
      {children}
    </header>
  )
}

Header.propTypes = {
  className: PT.string,
  gettingUserInfo: PT.bool,
  header: PT.element,
  isLoggingOut: PT.bool,
  username: PT.string
}

export default Header
