import SEDStart, { SEDStartProps } from 'applications/BUC/components/SEDStart/SEDStart'
import { standardLogger, timeDiffLogger, timeLogger } from 'metrics/loggers'
import React, { useEffect, useState } from 'react'
import Panel from 'nav-frontend-paneler'
import './SEDNew.css'

const SEDNew: React.FC<SEDStartProps> = (props: SEDStartProps): JSX.Element => {
  const [loggedTime] = useState<Date>(new Date())
  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    standardLogger('sed.new.entrance')
    return () => {
      timeLogger('sed.new.view', loggedTime)
      timeDiffLogger('sed.new.mouseover', totalTimeWithMouseOver)
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
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      <Panel className='a-buc-p-sednew s-border'>
        <SEDStart {...props} />
      </Panel>
    </div>
  )
}

export default SEDNew
