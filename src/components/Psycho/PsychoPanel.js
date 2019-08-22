import React, { Component } from 'react'
import PT from 'prop-types'
import * as Nav from '../Nav'
import Icons from '../Icons'
import Psycho from './Psycho'
import classNames from 'classnames'

import './Psycho.css'

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
    const { className, children, closeButton, type } = this.props

    if (this.state.hidden) {
      return null
    }

    return (
      <div className={classNames('c-psychoPanel', className)}>
        <Nav.Veilederpanel type='normal' svg={<Psycho type={type} />} kompakt>
          {children}
          {closeButton ? (
            <div className='closeButton'>
              <a
                href='#close' onClick={this.handleClose.bind(this)}
                style={{ position: 'absolute', top: '5px', right: '5px' }}
              >
                <Icons kind='nav-close' />
              </a>
            </div>
          ) : null}
        </Nav.Veilederpanel>
      </div>
    )
  }
}

PsychoPanel.propTypes = {
  children: PT.node.isRequired,
  className: PT.string,
  type: PT.string
}

export default PsychoPanel
