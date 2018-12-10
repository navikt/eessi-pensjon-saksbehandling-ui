import React, { Component } from 'react'
import PT from 'prop-types'

import * as smilendeOrangeVeileder from '../../../resources/images/nav-pensjon-smilende-orange-veileder.svg'
import * as tristOrangeVeileder from '../../../resources/images/nav-pensjon-trist-orange-veileder.svg'

class Psycho extends Component {
  getSvg () {
    const { type } = this.props

    switch (type) {
      case 'trist':
        return tristOrangeVeileder
      default:
        return smilendeOrangeVeileder
    }
  }

  render () {
    let svg = this.getSvg()
    return <img style={{ height: '100%' }} src={svg} alt='NAV-veideder' />
  }
}

Psycho.propTypes = {
  type: PT.string
}

export default Psycho
