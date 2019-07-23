import React from 'react'
import { Panel } from 'components/ui/Nav'
import SEDStart from 'applications/BUC/components/SEDStart/SEDStart'
import './SEDNew.css'

const SEDNew = (props) => {
  return <Panel className='a-buc-sednew'>
    <SEDStart {...props} />
  </Panel>
}

export default SEDNew
