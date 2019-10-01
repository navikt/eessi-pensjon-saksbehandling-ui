import React from 'react'

const NavPensjonSmilendeOrangeVeileder = ({ height, size, width }) => (
  <img
    width={(width || size || 220)}
    alt='nav-smilende-veileder'
    height={(height || size || 220)}
    src={require('./navPensjonSmilendeOrangeVeileder.png')}
  />
)

export default NavPensjonSmilendeOrangeVeileder
