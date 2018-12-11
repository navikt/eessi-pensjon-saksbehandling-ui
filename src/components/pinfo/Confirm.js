import React from 'react'

import Person from './Person'
import Bank from './Bank'
import StayAbroad from './StayAbroad/StayAbroad'

class Confirm extends React.Component {
  render () {
    const { pageError, onPageError } = this.props

    return <React.Fragment>
      <Person pageError={pageError} onPageError={onPageError} />
      <Bank pageError={pageError} onPageError={onPageError} />
      <StayAbroad pageError={pageError} onPageError={onPageError} />
    </React.Fragment>
  }
}

export default Confirm
