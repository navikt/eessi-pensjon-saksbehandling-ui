import React, { Component } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'

import * as Nav from '../ui/Nav'

class WaitingPanel extends Component {
  render () {
    const { t, message, className } = this.props

    return <div className={classNames('text-center', className)}>
      <Nav.NavFrontendSpinner />
      <p className='typo-normal'>{message}</p>
    </div>
  }
}

WaitingPanel.propTypes = {
  message: PT.string.isRequired,
  className: PT.string
}

export default WaitingPanel
