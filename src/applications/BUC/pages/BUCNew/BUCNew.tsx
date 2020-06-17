import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import BUCStart, { BUCStartProps } from 'applications/BUC/components/BUCStart/BUCStart'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React from 'react'
import './BUCNew.css'
import { useTranslation } from 'react-i18next'

export interface BUCNewProps extends BUCStartProps {
  aktoerId: string;
  setMode: (s: string) => void;
}

const BUCNew: React.FC<BUCNewProps> = ({ aktoerId, setMode } : BUCNewProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <>
      <Ui.Nav.Panel className='a-buc-p-bucnew s-border'>
        <Ui.Nav.Systemtittel>{t('buc:step-startBUCTitle')}</Ui.Nav.Systemtittel>
        <hr />
        <BUCStart aktoerId={aktoerId} setMode={setMode} />
      </Ui.Nav.Panel>
      <BUCFooter className='w-100 mt-2 mb-2' />
    </>
  )
}

BUCNew.propTypes = {
  aktoerId: PT.string.isRequired,
  setMode: PT.func.isRequired
}
export default BUCNew
