import BUCCrumbs from 'applications/BUC/components/BUCCrumbs/BUCCrumbs'
import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import BUCStart from 'applications/BUC/components/BUCStart/BUCStart'
import { BUCMode } from 'applications/BUC/index'
import { VerticalSeparatorDiv } from 'components/StyledComponents'
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
  aktoerId: string
  highContrast: boolean
}

const mapState = (state: State): BUCNewSelector => ({
  aktoerId: state.app.params.aktoerId,
  highContrast: state.ui.highContrast
})

export interface BUCNewProps {
  setMode: (mode: BUCMode, s: string, callback?: any) => void;
}

const BUCNewDiv = styled(Panel)`
  padding: 2rem 5rem 2rem 5rem !important;
  border: 1px solid ${({ theme }: any) => theme.navGra60};
  background-color: ${({ theme }: any) => theme['main-background-color']};
`
const BUCNewHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
`

const BUCNew: React.FC<BUCNewProps> = ({ setMode } : BUCNewProps): JSX.Element => {
  const { t } = useTranslation()
  const [loggedTime] = useState<Date>(new Date())
  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)
  const { aktoerId, highContrast } = useSelector<State, BUCNewSelector>(mapState)

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
        <BUCNewHeader>
          <BUCCrumbs
            bucs={undefined}
            currentBuc={undefined}
            mode='bucnew'
            setMode={setMode}
          />
        </BUCNewHeader>
        <VerticalSeparatorDiv />
        <BUCNewDiv>
          <Systemtittel>{t('buc:step-startBUCTitle')}</Systemtittel>
          <hr />
          <BUCStart
            aktoerId={aktoerId}
            setMode={setMode}
            onBucCreated={() => setMode('sednew', 'forward')}
            onBucCancelled={() => setMode('buclist', 'none')}
          />
        </BUCNewDiv>
        <BUCFooter />
      </div>
    </ThemeProvider>
  )
}

BUCNew.propTypes = {
  setMode: PT.func.isRequired
}
export default BUCNew
