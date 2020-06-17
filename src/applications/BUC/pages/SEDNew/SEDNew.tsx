import SEDStart, { SEDStartProps } from 'applications/BUC/components/SEDStart/SEDStart'
import Ui from 'eessi-pensjon-ui'
import React from 'react'
import './SEDNew.css'

const SEDNew: React.FC<SEDStartProps> = (props: SEDStartProps): JSX.Element => (
  <Ui.Nav.Panel className='a-buc-p-sednew s-border'>
    <SEDStart {...props} />
  </Ui.Nav.Panel>
)

export default SEDNew
