import React from 'react'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'

import Person from './Person'
import Bank from './Bank'
import StayAbroad from './StayAbroad/StayAbroad'
import PsychoPanel from '../ui/Psycho/PsychoPanel'
import * as Nav from '../ui/Nav'

class Confirm extends React.Component {
  render () {
    const { t, pageErrors, errorTimestamp } = this.props

    return <React.Fragment>
      <PsychoPanel id='pinfo-confirm-psycho-panel' className='mb-4' closeButton>
        <span>{t('pinfo:confirm-psycho-description')}</span>
      </PsychoPanel>
      <Nav.Undertittel className='ml-0 mb-4 appDescription'>{t('pinfo:confirm-title')}</Nav.Undertittel>
      <Person pageErrors={pageErrors} errorTimestamp={errorTimestamp} mode='view' />
      <Bank pageErrors={pageErrors} errorTimestamp={errorTimestamp} mode='view' />
      <StayAbroad pageErrors={pageErrors} errorTimestamp={errorTimestamp} mode='view' />
    </React.Fragment>
  }
}

Confirm.propTypes = {
  pageErrors: PT.object,
  errorTimestamp: PT.number
}

export default withNamespaces()(Confirm)
