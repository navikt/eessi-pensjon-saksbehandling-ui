import React, { Component } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { NavFrontendSpinner } from 'components/Nav'

class WaitingPanel extends Component {
  render () {
    const { message, className } = this.props

    return <div className={classNames('c-waitingPanel', 'text-center', className)}>
      <NavFrontendSpinner />
      <p className='c-waitingPanel-message typo-normal'>{message}</p>
    </div>
  }
}

WaitingPanel.propTypes = {
  message: PT.string.isRequired,
  className: PT.string
}

export default WaitingPanel
