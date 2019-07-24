import React, { Component } from 'react'
import PT from 'prop-types'
import SmilendeOrangeVeileder from 'resources/images/NavPensjonSmilendeOrangeVeileder'
import TristOrangeVeileder from 'resources/images/NavPensjonTristOrangeVeileder'

class Psycho extends Component {
  render () {
    const { type } = this.props

    return type === 'trist' ? <TristOrangeVeileder width='130' height='130' /> : <SmilendeOrangeVeileder width='130' height='130' />
  }
}

Psycho.propTypes = {
  type: PT.string
}

export default Psycho
