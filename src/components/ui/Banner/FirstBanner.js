import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'

import FirstPanel from '../Panel/FirstPanel'

import './Banner.css'

class Banner extends Component {
  render () {
    const { t } = this.props

    return <div className='c-ui-banner'>
      <h1 className='typo-sidetittel'>{t('app-headerTitle')}</h1>
      <FirstPanel />
    </div>
  }
}

export default withNamespaces()(Banner)
