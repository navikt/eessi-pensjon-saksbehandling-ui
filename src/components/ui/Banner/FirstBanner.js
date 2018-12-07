import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'

import PsychoBanner from '../Banner/PsychoBanner'
import * as Nav from '../Nav'

import './Banner.css'

class FirstBanner extends Component {
  render () {
    const { t } = this.props

    return <div className='c-ui-banner'>
      <Nav.Sidetittel className='pt-5 pb-5 pl-5'>{t('app-headerTitle')}</Nav.Sidetittel>
      <PsychoBanner>
        <span>Sample text</span>
      </PsychoBanner>
    </div>
  }
}

export default withNamespaces()(FirstBanner)
