import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import BUCStart, { BUCStartProps } from 'applications/BUC/components/BUCStart/BUCStart'
import { State } from 'declarations/reducers'
import { standardLogger, timeDiffLogger, timeLogger } from 'metrics/loggers'
import Panel from 'nav-frontend-paneler'
import { Systemtittel } from 'nav-frontend-typografi'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'

export interface BUCNewSelector {
  highContrast: boolean
}

const mapState = (state: State): BUCNewSelector => ({
  highContrast: state.ui.highContrast
})

export interface BUCNewProps extends BUCStartProps {
  aktoerId: string;
  setMode: (s: string) => void;
}

const BUCNewDiv = styled(Panel)`
  padding: 2rem 5rem 2rem 5rem !important;
  border: 1px solid ${({ theme }: any) => theme.navGra40};
  background-color: ${({ theme }: any) => theme['main-background-color']};
`

const BUCNew: React.FC<BUCNewProps> = ({ aktoerId, setMode } : BUCNewProps): JSX.Element => {
  const { t } = useTranslation()
  const [loggedTime] = useState<Date>(new Date())
  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)
  const { highContrast } = useSelector<State, BUCNewSelector>(mapState)

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
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <BUCNewDiv>
          <Systemtittel>{t('buc:step-startBUCTitle')}</Systemtittel>
          <hr />
          <BUCStart aktoerId={aktoerId} setMode={setMode} />
        </BUCNewDiv>
        <BUCFooter />
      </div>
    </ThemeProvider>
  )
}

BUCNew.propTypes = {
  aktoerId: PT.string.isRequired,
  setMode: PT.func.isRequired
}
export default BUCNew
