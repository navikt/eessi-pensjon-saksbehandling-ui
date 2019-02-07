import React, { Component } from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'

import * as navLogo from '../../../../resources/images/nav-logo-red.png'
import * as constants from '../../../../constants/constants'
import { renderDate } from '../../../../utils/Date'

import './Summary.css'
import '../Menu.css'

class ExportHeader extends Component {
  render () {
    const { t, blackAndWhite, header } = this.props

    return <div>
      {header ? <header className='mb-4'>
        <img alt='logo' src={navLogo} className={classNames(blackAndWhite ? 'blackAndWhite' : '')} />
        <div className='dots' />
      </header> : null}
      <h4 className='text-left pt-4 pb-4'>{constants.P4000}</h4>
      <div className='pb-4 pb-4 flexrow'>
        <div>{t('case:form-sakId')}{': '}</div>
        <div>{t('ui:sentDate')}{': '}{renderDate(new Date())}</div>
      </div>
    </div>
  }
}

ExportHeader.propTypes = {
  t: PT.func,
  username: PT.string.isRequired,
  header: PT.bool.isRequired,
  blackAndWhite: PT.bool.isRequired
}

export default withTranslation()(ExportHeader)
