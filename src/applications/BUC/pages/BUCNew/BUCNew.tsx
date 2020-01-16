import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import BUCStart, { BUCStartProps } from 'applications/BUC/components/BUCStart/BUCStart'
import { T } from 'declarations/types'
import { TPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import React from 'react'
import './BUCNew.css'

export interface BUCNewProps extends BUCStartProps {
  t: T
}

const BUCNew: React.FC<BUCNewProps> = (props: BUCNewProps): JSX.Element => {
  const { t } = props
  return (
    <>
      <Ui.Nav.Panel className='a-buc-p-bucnew s-border'>
        <Ui.Nav.Systemtittel>{t('buc:step-startBUCTitle')}</Ui.Nav.Systemtittel>
        <hr />
        <BUCStart {...props} />
      </Ui.Nav.Panel>
      <BUCFooter className='w-100 mt-2 mb-2' {...props} />
    </>
  )
}

BUCNew.propTypes = {
  t: TPropType.isRequired
}
export default BUCNew
