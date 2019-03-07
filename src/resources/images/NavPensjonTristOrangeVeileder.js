import React from 'react'

export default (props) => (
  <img width={(props.width || props.size || 220)} alt='nav-veileder'
    height={(props.height || props.size || 220)}
    src={require('./navPensjonTristOrangeVeileder.png')} />
)
