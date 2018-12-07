import React, { Component } from 'react'
import PT from 'prop-types'
import Psycho from '../Psycho/Psycho'
import * as Nav from '../Nav'

class PsychoBanner extends Component {
  render () {

    const { children } = this.props

    return <Nav.Veileder tekst={children}>
      <Psycho/>
    </Nav.Veileder>
  }
}

PsychoBanner.propTypes = {
    children: PT.node.isRequired
}

export default PsychoBanner
