import React, { Component } from 'react'
import PT from 'prop-types'
import * as Nav from '../Nav'
import Icons from '../Icons'
import Veileder from './Veileder'

class VeilederPanel extends Component {
  state = {
    hidden: false
  }

  handleClose (e) {
    e.preventDefault()
    e.stopPropagation()

    this.setState({
      hidden: true
    })
  }

  render () {
    if (this.state.hidden) {
      return null
    }

    return <div className={this.props.className}>
       <Nav.Veilederpanel type='normal' svg={<Veileder/>} kompakt>
      {this.props.children}
      <div className='closeButton'>
        <a href='#' onClick={this.handleClose.bind(this)}
          style={{ position: 'absolute', top: '5px', right: '5px' }}>
          <Icons kind='nav-close' />
        </a>
      </div>
    </Nav.Veilederpanel>
  </div>
  }
}

export default VeilederPanel
