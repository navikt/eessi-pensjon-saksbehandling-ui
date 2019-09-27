import React from 'react'
import { Nav } from 'eessi-pensjon-ui'
import SEDStart from 'applications/BUC/components/SEDStart/SEDStart'
import './SEDNew.css'

const SEDNew = (props) => {
  return (
    <Nav.Panel className='a-buc-sednew s-border'>
      <SEDStart {...props} />
    </Nav.Panel>
  )
}

export default SEDNew
