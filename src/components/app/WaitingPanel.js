import React, { Component } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { withNamespaces } from 'react-i18next'
import * as Nav from '../ui/Nav'

class WaitingPanel extends Component {
  render () {
    const { t, message } = this.props

    return <div className={classNames('text-center')}>
      <Nav.NavFrontendSpinner />
      <p className='typo-normal'>{t(message)}</p>
    </div>
  }
}

WaitingPanel.propTypes = {
  message: PT.string.isRequired
}

export default withNamespaces(WaitingPanel)
