import React from 'react'

const NavPensjonSmilendeOrangeVeileder = (props) => {
  return (
    <img
      width={(props.width || props.size || 220)}
      alt='nav-smilende-veileder'
      height={(props.height || props.size || 220)}
      src={require('./navPensjonSmilendeOrangeVeileder.png')}
    />
  )
}

export default NavPensjonSmilendeOrangeVeileder
