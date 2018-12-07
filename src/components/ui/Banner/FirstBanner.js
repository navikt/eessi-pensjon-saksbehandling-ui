import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'

import FirstPanel from '../Panel/FirstPanel'

import './Banner.css'

class Banner extends Component {
  render () {
    const { t, i18Key, veilI18Key } = this.props
    let key = i18Key? i18Key: 'app-headerTitle'
    let veilText = veilI18Key? t(veilI18Key): ''
    return <div className='c-ui-banner'>
      <h1 className='typo-sidetittel'>{t(key)}</h1>
      <FirstPanel text={veilText}/>
    </div>
  }
}

export default withNamespaces()(Banner)
