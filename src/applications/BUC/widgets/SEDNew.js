import React from 'react'
import { Panel } from 'components/ui/Nav'
import SEDStart from 'applications/BUC/components/SEDStart/SEDStart'

const SEDNew = (props) => {
  return <Panel>
    <SEDStart {...props} />
  </Panel>
}

export default SEDNew
