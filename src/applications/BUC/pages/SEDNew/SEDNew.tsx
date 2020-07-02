import SEDStart, { SEDStartProps } from 'applications/BUC/components/SEDStart/SEDStart'
import { BUCNewSelector } from 'applications/BUC/pages/BUCNew/BUCNew'
import { State } from 'declarations/reducers'
import { standardLogger, timeDiffLogger, timeLogger } from 'metrics/loggers'
import Panel from 'nav-frontend-paneler'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'

const SEDNewDiv = styled(Panel)`
  padding: 2rem 5rem 2rem 5rem !important;
  border: 1px solid ${({ theme }: any) => theme.navGra40};
  background-color: ${({ theme }: any) => theme['main-background-color']};
`

export interface SEDNewSelector {
  highContrast: boolean
}

const mapState = (state: State): SEDNewSelector => ({
  highContrast: state.ui.highContrast
})

const SEDNew: React.FC<SEDStartProps> = (props: SEDStartProps): JSX.Element => {
  const [loggedTime] = useState<Date>(new Date())
  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)
  const { highContrast } = useSelector<State, BUCNewSelector>(mapState)

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
        <SEDNewDiv>
          <SEDStart {...props} />
        </SEDNewDiv>
      </div>
    </ThemeProvider>
  )
}

export default SEDNew
