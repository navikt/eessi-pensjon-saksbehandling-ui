import React, { Component } from 'react'
import PT from 'prop-types'

import * as smilende_orange_veileder from '../../../resources/images/nav-pensjon-smilende-orange-veileder.svg'
import * as trist_orange_veileder from '../../../resources/images/nav-pensjon-trist-orange-veileder.svg'

class Veileder extends Component {

  getSvg () {

     const { type } = this.props

     switch (type) {

        case 'trist':
        return trist_orange_veileder
        default:
        return smilende_orange_veileder

     }
  }

  render () {

    let svg = this.getSvg()
    return <img style={{height: '100%'}} src={svg} alt='NAV-veideder' />
  }
}

Veileder.propTypes = {
  type: PT.string
}

export default Veileder
