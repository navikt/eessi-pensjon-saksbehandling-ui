import React, { Component } from 'react'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'

import LogoHeader from '../../components/ui/Header/LogoHeader'
import FirstBanner from '../../components/ui/Banner/FirstBanner'

class ErrorPage extends Component {
  render () {
    const { t } = this.props
    return <div className='p-firstPage hodefot'>
      <LogoHeader />
      <FirstBanner />
      <div className='content'>
        <h2>{t('ui:app-errorPageTitle')}</h2>
      </div>
    </div>
  }
}

ErrorPage.propTypes = {
  t: PT.func
}

export default withNamespaces()(ErrorPage)
