import React, { Component } from 'react'
import PT from 'prop-types'
import SmilendeOrangeVeileder from 'resources/images/NavPensjonSmilendeOrangeVeileder'
import TristOrangeVeileder from 'resources/images/NavPensjonTristOrangeVeileder'

const Psycho = (props) => {

  const { type = 'smilende' } = props

  return <div className='c-psycho'>
    {type === 'trist' ?
    <TristOrangeVeileder width='130' height='130' /> :
    <SmilendeOrangeVeileder width='130' height='130' />}
  </div>
}

Psycho.propTypes = {
  type: PT.string
}

export default Psycho
