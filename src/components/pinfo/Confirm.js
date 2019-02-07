import React from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'

import Person from './Person'
import Bank from './Bank'
import StayAbroad from './StayAbroad/StayAbroad'
import PsychoPanel from '../ui/Psycho/PsychoPanel'
import * as Nav from '../ui/Nav'

class Confirm extends React.Component {
  render () {
    const { t } = this.props

    return <React.Fragment>
      <PsychoPanel id='pinfo-confirm-psycho-panel' className='mb-4' closeButton>
        <span>{t('pinfo:confirm-psycho-description')}</span>
      </PsychoPanel>
      <Nav.Undertittel className='ml-0 mb-4 appDescription'>{t('pinfo:confirm-title')}</Nav.Undertittel>
      <Person mode='view' />
      <Bank mode='view' />
      <StayAbroad mode='view' />
    </React.Fragment>
  }
}

Confirm.propTypes = {
  t: PT.func.isRequired
}

export default withTranslation()(Confirm)
