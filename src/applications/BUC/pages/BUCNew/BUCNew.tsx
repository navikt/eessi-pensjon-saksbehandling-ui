import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import BUCStart, { BUCStartProps } from 'applications/BUC/components/BUCStart/BUCStart'
import { Nav } from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React from 'react'
import { RinaUrl } from 'types'
import './BUCNew.css'

export interface BUCNewProps extends BUCStartProps {
  rinaUrl?: RinaUrl
}

const BUCNew = (props: BUCNewProps) => {
  const { t } = props
  return (
    <>
      <Nav.Panel className='a-buc-p-bucnew s-border'>
        <Nav.Systemtittel>{t('buc:step-startBUCTitle')}</Nav.Systemtittel>
        <hr />
        <BUCStart mode='widget' {...props} />
      </Nav.Panel>
      <BUCFooter className='w-100 mt-2 mb-2' {...props} />
    </>
  )
}

BUCNew.propTypes = {
  t: PT.func.isRequired
}
export default BUCNew
