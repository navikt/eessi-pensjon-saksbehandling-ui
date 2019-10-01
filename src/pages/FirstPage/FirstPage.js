import React from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import 'url-search-params-polyfill'
import { Nav, Psycho } from 'eessi-pensjon-ui'
import TopContainer from 'components/TopContainer/TopContainer'
import * as routes from 'constants/routes'

import './FirstPage.css'

export const FirstPage = ({ t, history }) => {
  const handleForwardButtonClick = () => {
    history.push({
      pathname: routes.PINFO,
      search: window.location.search
    })
  }

  return (
    <TopContainer
      className='p-firstPage'
      t={t}
      history={history}
      header={<span>{t('pinfo:app-title')}</span>}
    >
      <div className='content container pt-4'>
        <div className='col-sm-3 col-12' />
        <div className='col-12'>
          <div className='psycho text-center mt-3 mb-4'>
            <Psycho id='psycho' />
          </div>
          <div dangerouslySetInnerHTML={{ __html: t('pinfo:psycho-description-saksbehandler') }} />
          <div className='text-center mt-3 mb-4'>
            <Nav.Hovedknapp
              id='pinfo-firstPage-forwardButton'
              className='mt-3 forwardButton'
              onClick={handleForwardButtonClick}
            >{t('continue')}
            </Nav.Hovedknapp>
          </div>
        </div>
        <div className='col-sm-3 col-12' />
      </div>
    </TopContainer>
  )
}

FirstPage.propTypes = {
  t: PT.func.isRequired,
  history: PT.object.isRequired
}

export default withTranslation()(FirstPage)
