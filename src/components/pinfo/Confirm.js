import React from 'react'

import Person from './Person'
import Bank from './Bank'
import StayAbroad from './StayAbroad/StayAbroad'

class Confirm extends React.Component {
  render () {
    const { pageErrors } = this.props

    return <React.Fragment>
      <Person pageErrors={pageErrors} />
      <Bank pageErrors={pageErrors} />
      <StayAbroad pageErrors={pageErrors} />
    </React.Fragment>
  }
}

export default Confirm
