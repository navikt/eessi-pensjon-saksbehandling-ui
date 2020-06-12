import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import BUCStart, { BUCStartProps } from 'applications/BUC/components/BUCStart/BUCStart'
import Ui from 'eessi-pensjon-ui'
import { standardLogger, timeDiffLogger, timeLogger } from 'metrics/loggers'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import './BUCNew.css'
import { useTranslation } from 'react-i18next'

export interface BUCNewProps extends BUCStartProps {
  aktoerId: string;
  setMode: (s: string) => void;
}

const BUCNew: React.FC<BUCNewProps> = ({ aktoerId, setMode } : BUCNewProps): JSX.Element => {
  const { t } = useTranslation()
  const [loggedTime] = useState<Date>(new Date())
  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    standardLogger('buc.new.entrance')
    return () => {
      timeLogger('buc.new.view', loggedTime)
      timeDiffLogger('buc.new.mouseover', totalTimeWithMouseOver)
    }
  })

  const onMouseEnter = () => setMouseEnterDate(new Date())

  const onMouseLeave = () => {
    if (mouseEnterDate) {
      setTotalTimeWithMouseOver(totalTimeWithMouseOver + (new Date().getTime() - mouseEnterDate?.getTime()))
    }
  }

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Ui.Nav.Panel className='a-buc-p-bucnew s-border'>
        <Ui.Nav.Systemtittel>{t('buc:step-startBUCTitle')}</Ui.Nav.Systemtittel>
        <hr />
        <BUCStart aktoerId={aktoerId} setMode={setMode} />
      </Ui.Nav.Panel>
      <BUCFooter className='w-100 mt-2 mb-2' />
    </div>
  )
}

BUCNew.propTypes = {
  aktoerId: PT.string.isRequired,
  setMode: PT.func.isRequired
}
export default BUCNew
