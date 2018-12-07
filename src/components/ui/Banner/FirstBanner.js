import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'

import FirstPanel from '../Panel/FirstPanel'
import * as Nav from '../Nav'

import './Banner.css'

class Banner extends Component {
  render () {
    const { t } = this.props

    return <div className='c-ui-banner'>
      <Nav.Sidetittel>{t('app-headerTitle')}</Nav.Sidetittel>
      <FirstPanel />
    </div>
  }
}

export default withNamespaces()(Banner)
