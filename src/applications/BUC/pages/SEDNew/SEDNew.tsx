import BUCCrumbs from 'applications/BUC/components/BUCCrumbs/BUCCrumbs'
import SEDStart from 'applications/BUC/components/SEDStart/SEDStart'
import { BUCMode } from 'applications/BUC/index'
import { BUCNewSelector } from 'applications/BUC/pages/BUCNew/BUCNew'
import { VerticalSeparatorDiv } from 'components/StyledComponents'
import { AttachedFiles, Bucs } from 'declarations/buc'
import { State } from 'declarations/reducers'
import { standardLogger, timeDiffLogger, timeLogger } from 'metrics/loggers'
import Panel from 'nav-frontend-paneler'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'

const SEDNewDiv = styled(Panel)`
  padding: 2rem 5rem 2rem 5rem !important;
  border: 1px solid ${({ theme }: any) => theme.navGra60};
  background-color: ${({ theme }: any) => theme['main-background-color']};
`
const SEDNewHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
`

export interface SEDNewSelector {
  highContrast: boolean
}

const mapState = (state: State): SEDNewSelector => ({
  highContrast: state.ui.highContrast
})

export interface SEDNewProps {
  aktoerId?: string
  bucs: Bucs
  currentBuc: string
  initialAttachments ?: AttachedFiles
  initialSed ?: string | undefined
  initialStep ?: number
  setMode: (mode: BUCMode) => void
}

const SEDNew: React.FC<SEDNewProps> = (props: SEDNewProps): JSX.Element => {
  const [loggedTime] = useState<Date>(new Date())
  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)
  const { highContrast } = useSelector<State, BUCNewSelector>(mapState)
  const { setMode, currentBuc, bucs } = props

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
            {...props}
            onSedCreated={() => setMode('bucedit')}
            onSedCancelled={() => setMode('bucedit')}
          />
        </SEDNewDiv>
      </div>
    </ThemeProvider>
  )
}

export default SEDNew
