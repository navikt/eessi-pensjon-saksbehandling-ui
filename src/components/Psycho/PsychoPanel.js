import React, { useState } from 'react'
import PT from 'prop-types'
import { Veilederpanel } from 'components/Nav'
import Icons from 'components/Icons'
import Psycho from './Psycho'
import classNames from 'classnames'

import './Psycho.css'

const PsychoPanel = (props) => {

  const { children, className, closeButton, type } = props
  const [ hidden, setHidden ] = useState(false)

  const handleClose = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setHidden(true)
  }

  if (hidden) {
    return null
  }

  return (
    <div className={classNames('c-psychoPanel', className)}>
      <Veilederpanel type='normal' svg={<Psycho type={type} />} kompakt>
        {children}
        {closeButton ? (
          <div className='closeButton'>
            <a
              href='#close' onClick={handleClose}
              style={{ position: 'absolute', top: '5px', right: '5px' }}
            >
              <Icons kind='nav-close' />
            </a>
          </div>
        ) : null}
      </Veilederpanel>
    </div>
  )
}

PsychoPanel.propTypes = {
  children: PT.node.isRequired,
  className: PT.string,
  closeButton: PT.bool,
  type: PT.string
}

export default PsychoPanel
