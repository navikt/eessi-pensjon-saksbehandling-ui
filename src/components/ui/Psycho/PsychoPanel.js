import React, { Component } from 'react'
import PT from 'prop-types'
import * as Nav from '../Nav'
import Icons from '../Icons'
import Psycho from './Psycho'

class PsychoPanel extends Component {
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

    const { className, children } = this.props

    if (this.state.hidden) {
      return null
    }

    return <div className={className}>
      <Nav.Veilederpanel type='normal' svg={<Psycho/>} kompakt>
      {children}
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

PsychoPanel.propTypes = {
  children: PT.node.isRequired,
  className: PT.string
}

export default PsychoPanel
