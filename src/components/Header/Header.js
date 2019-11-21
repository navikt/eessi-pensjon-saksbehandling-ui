import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { Icons, Nav } from 'eessi-pensjon-ui'
import * as routes from 'constants/routes'
import NavLogoTransparent from 'resources/images/NavLogoTransparent'
import './Header.css'

const Header = ({ actions, children, gettingUserInfo, header, history, isLoggingOut, t, username }) => {
  const onLogoClick = () => {
    actions.clearData()
    history.push({
      pathname: routes.ROOT,
      search: window.location.search
    })
  }

  const handleUsernameSelectRequest = (e) => {
    if (e.target.value === 'logout') {
      actions.clearData()
      actions.logout()
    }
  }

  return (
    <header role='banner'>
      <div className='c-topHeader'>
        <div className='brand'>
          <a href='#index' id='c-topHeader__logo-link' onClick={onLogoClick}>
            <NavLogoTransparent width='100' height='45' color='white' />
          </a>
          <div className='skillelinje' />
          <div className='tittel'><span>{t('app-headerTitle')}</span></div>
        </div>
        <div>
          <Nav.Lenke
            id='c-topHeader__highcontrast-link-id'
            className='c-topHeader__highcontrast-link mt-1'
            href='#highContrast'
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              actions.toggleHighContrast()
            }}
          >
            {t('ui:highContrast')}
          </Nav.Lenke>
        </div>
        <div className='user'>
          {isLoggingOut
            ? <Nav.Spinner type='XS' />
            : (
              <div className={classNames('mr-2', 'SAKSBEHANDLER')}>
                <Icons kind='user' />
              </div>
            )}
          <div className='skillelinje' />
          <div className='mr-4 ml-2 align-middle name'>
            {gettingUserInfo ? t('buc:loading-gettingUserInfo')
              : username
                ? (
                  <Nav.Select
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
                  </Nav.Select>
                )
                : (
                  <>
                    <Icons kind='advarsel' size={16} />
                    <span className='username-span'>{t('unknown')}</span>
                  </>
                )}
          </div>
        </div>
      </div>
      {header
        ? (
          <Nav.Systemtittel className='m-4'>
            {header}
          </Nav.Systemtittel>
        )
        : null}
      {children}
    </header>
  )
}

Header.propTypes = {
  actions: PT.object.isRequired,
  gettingUserInfo: PT.bool,
  header: PT.oneOfType([PT.node, PT.string]),
  history: PT.object,
  isLoggingOut: PT.bool,
  t: PT.func.isRequired,
  username: PT.string
}

export default Header
