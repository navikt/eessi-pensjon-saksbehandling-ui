import BUCCrumbs from 'applications/BUC/components/BUCCrumbs/BUCCrumbs'
import SEDStart from 'applications/BUC/components/SEDStart/SEDStart'
import { BUCMode } from 'applications/BUC/index'
import { VerticalSeparatorDiv } from 'components/StyledComponents'
import { AttachedFiles, Bucs } from 'declarations/buc'
import { State } from 'declarations/reducers'
import { standardLogger, timeDiffLogger, timeLogger } from 'metrics/loggers'
import Panel from 'nav-frontend-paneler'
import { theme, themeKeys, themeHighContrast } from 'nav-styled-component-theme'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'

const SEDNewDiv = styled(Panel)`
  padding: 2rem 5rem 2rem 5rem !important;
  border: 1px solid ${({ theme }) => theme[themeKeys.MAIN_BORDER_COLOR]};
  background-color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
`
const SEDNewHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
`

export interface SEDNewSelector {
  aktoerId: string
  highContrast: boolean
  bucs: Bucs | undefined
  currentBuc: string | undefined
}

const mapState = (state: State): SEDNewSelector => ({
  aktoerId: state.app.params.aktoerId,
  highContrast: state.ui.highContrast,
  bucs: state.buc.bucs,
  currentBuc: state.buc.currentBuc
})

export interface SEDNewProps {
  initialAttachments ?: AttachedFiles
  initialSed ?: string | undefined
  initialStep ?: number
  setMode: (mode: BUCMode, s: string, callback?: any) => void
}

const SEDNew: React.FC<SEDNewProps> = (props: SEDNewProps): JSX.Element => {
  const [loggedTime] = useState<Date>(new Date())
  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)
  const { aktoerId, currentBuc, bucs, highContrast } = useSelector<State, SEDNewSelector>(mapState)
  const { setMode } = props

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
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <div
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
      >
        <SEDNewHeader>
          <BUCCrumbs
            bucs={bucs}
            currentBuc={currentBuc}
            mode='sednew'
            setMode={setMode}
          />
        </SEDNewHeader>
        <VerticalSeparatorDiv />
        <SEDNewDiv>
          <SEDStart
            aktoerId={aktoerId}
            bucs={bucs!}
            currentBuc={currentBuc!}
            setMode={setMode}
            onSedCreated={() => setMode('bucedit', 'none')}
            onSedCancelled={() => setMode('bucedit', 'none')}
          />
        </SEDNewDiv>
      </div>
    </ThemeProvider>
  )
}

export default SEDNew
