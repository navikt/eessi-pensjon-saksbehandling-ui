import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { NavFrontendSpinner } from 'components/Nav'

const WaitingPanel = (props) => {
  const { message, className } = props

  return <div className={classNames('c-waitingPanel', 'text-center', className)}>
    <NavFrontendSpinner />
    <p className='c-waitingPanel__message typo-normal'>{message}</p>
  </div>
}

WaitingPanel.propTypes = {
  message: PT.string.isRequired,
  className: PT.string
}

export default WaitingPanel
