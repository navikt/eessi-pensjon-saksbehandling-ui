import SEDStart, { SEDStartProps } from 'applications/BUC/components/SEDStart/SEDStart'
import { Nav } from 'eessi-pensjon-ui'
import React from 'react'
import './SEDNew.css'

const SEDNew = (props: SEDStartProps) => (
  <Nav.Panel className='a-buc-p-sednew s-border'>
    <SEDStart {...props} />
  </Nav.Panel>
)

export default SEDNew
