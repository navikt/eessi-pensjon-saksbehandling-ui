import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import BUCStart, { BUCStartProps } from 'applications/BUC/components/BUCStart/BUCStart'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React from 'react'
import { RinaUrl } from 'types.d'
import './BUCNew.css'

export interface BUCNewProps extends BUCStartProps {
  rinaUrl?: RinaUrl
}

const BUCNew = (props: BUCNewProps) => {
  const { t } = props
  return (
    <>
      <Ui.Nav.Panel className='a-buc-p-bucnew s-border'>
        <Ui.Nav.Systemtittel>{t('buc:step-startBUCTitle')}</Ui.Nav.Systemtittel>
        <hr />
        <BUCStart mode='widget' {...props} />
      </Ui.Nav.Panel>
      <BUCFooter className='w-100 mt-2 mb-2' {...props} />
    </>
  )
}

BUCNew.propTypes = {
  t: PT.func.isRequired
}
export default BUCNew
