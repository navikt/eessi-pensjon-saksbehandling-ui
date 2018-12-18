import React from 'react'
import PT from 'prop-types'

import Person from './Person'
import Bank from './Bank'
import StayAbroad from './StayAbroad/StayAbroad'

class Confirm extends React.Component {
  render () {
    const { pageErrors, errorTimestamp } = this.props

    return <React.Fragment>
      <Person pageErrors={pageErrors} errorTimestamp={errorTimestamp} />
      <Bank pageErrors={pageErrors} errorTimestamp={errorTimestamp} disableHelpText={true}/>
      <StayAbroad pageErrors={pageErrors} errorTimestamp={errorTimestamp} mode='view' />
    </React.Fragment>
  }
}

Confirm.propTypes = {
  pageErrors: PT.object,
  errorTimestamp: PT.number
}

export default Confirm
