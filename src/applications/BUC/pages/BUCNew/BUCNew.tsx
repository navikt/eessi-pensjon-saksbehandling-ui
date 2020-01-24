import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import BUCStart, { BUCStartProps } from 'applications/BUC/components/BUCStart/BUCStart'
import { T } from 'declarations/types'
import { TPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React from 'react'
import './BUCNew.css'

export interface BUCNewProps extends BUCStartProps {
  aktoerId: string;
  setMode: (s: string) => void;
  t: T
}

const BUCNew: React.FC<BUCNewProps> = ({ aktoerId, setMode, t } : BUCNewProps): JSX.Element => {
  return (
    <>
      <Ui.Nav.Panel className='a-buc-p-bucnew s-border'>
        <Ui.Nav.Systemtittel>{t('buc:step-startBUCTitle')}</Ui.Nav.Systemtittel>
        <hr />
        <BUCStart aktoerId={aktoerId} setMode={setMode} t={t} />
      </Ui.Nav.Panel>
      <BUCFooter className='w-100 mt-2 mb-2' t={t} />
    </>
  )
}

BUCNew.propTypes = {
  aktoerId: PT.string.isRequired,
  setMode: PT.func.isRequired,
  t: TPropType.isRequired
}
export default BUCNew
