import React, { Component } from 'react'

import Veileder from './Veileder'
import * as Nav from '../Nav'

class FirstPanel extends Component {
  render () {
    return <Nav.Veileder tekst={<div>sample text</div>}>
      <Veileder/>
    </Nav.Veileder>
  }
}

export default FirstPanel
