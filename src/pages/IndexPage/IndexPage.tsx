import { BUCMode } from 'applications/BUC'
import ContextBanner from 'components/ContextBanner/ContextBanner'
import TopContainer from 'components/TopContainer/TopContainer'
import { State } from 'declarations/reducers'
import { timeLogger } from 'metrics/loggers'
import Dashboard, { LayoutTabs, Widgets } from 'nav-dashboard'
import 'rc-tooltip/assets/bootstrap_white.css'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import * as extraWidgets from 'widgets'

export interface IndexPageProps {
  username?: string
}

const defaultLayouts: LayoutTabs = [{
  label: 'default',
  body: {
    lg: [
      { i: 'w-1-overview', x: 0, y: 0, w: 12, h: 1, minW: 6, maxW: 12, minH: 1, maxH: 999 },
      { i: 'w-2-buc', x: 0, y: 2, w: 12, h: 6, minW: 6, maxW: 12, minH: 2, maxH: 999 }
    ],
    md: [
      { i: 'w-1-overview', x: 0, y: 0, w: 3, h: 1, minW: 2, maxW: 3, minH: 1, maxH: 999 },
      { i: 'w-2-buc', x: 0, y: 2, w: 3, h: 6, minW: 2, maxW: 3, minH: 2, maxH: 999 }
    ],
    sm: [
      { i: 'w-1-overview', x: 0, y: 0, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 999 },
      { i: 'w-2-buc', x: 0, y: 2, w: 1, h: 6, minW: 1, maxW: 1, minH: 2, maxH: 999 }
    ]
  }
}]

const defaultLayoutsWithVarsel: LayoutTabs = [{
  label: 'default',
  body: {
    lg: [
      { i: 'w-1-overview', x: 0, y: 0, w: 12, h: 1, minW: 6, maxW: 12, minH: 1, maxH: 999 },
      { i: 'w-2-buc', x: 0, y: 2, w: 12, h: 6, minW: 6, maxW: 12, minH: 2, maxH: 999 },
      { i: 'w-3-varsler', x: 0, y: 8, w: 12, h: 2, minW: 6, maxW: 12, minH: 2, maxH: 999 }
    ],
    md: [
      { i: 'w-1-overview', x: 0, y: 0, w: 3, h: 1, minW: 2, maxW: 3, minH: 1, maxH: 999 },
      { i: 'w-2-buc', x: 0, y: 2, w: 3, h: 6, minW: 2, maxW: 3, minH: 2, maxH: 999 },
      { i: 'w-3-varsler', x: 0, y: 8, w: 3, h: 2, minW: 2, maxW: 3, minH: 2, maxH: 999 }

    ],
    sm: [
      { i: 'w-1-overview', x: 0, y: 0, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 999 },
      { i: 'w-2-buc', x: 0, y: 2, w: 1, h: 6, minW: 1, maxW: 1, minH: 2, maxH: 999 },
      { i: 'w-3-varsler', x: 0, y: 8, w: 1, h: 2, minW: 1, maxW: 1, minH: 2, maxH: 999 }
    ]
  }
}]

const defaultWidgets: Widgets = [{
  i: 'w-1-overview',
  type: 'overview',
  title: 'Overview widget',
  visible: true,
  options: {
    collapsed: true
  }
}, {
  i: 'w-2-buc',
  type: 'buc',
  title: 'BUC widget',
  visible: true,
  options: {
    allowFullScreen: true
  }
}, {
  i: 'w-3-varsler',
  type: 'varsler',
  title: 'Varsler widget',
  visible: true,
  options: {}
}]

const defaultWidgetsWithVarsel: Widgets = [{
  i: 'w-1-overview',
  type: 'overview',
  title: 'Overview widget',
  visible: true,
  options: {
    collapsed: true
  }
}, {
  i: 'w-2-buc',
  type: 'buc',
  title: 'BUC widget',
  visible: true,
  options: {
    allowFullScreen: false
  }
}, {
  i: 'w-3-varsler',
  type: 'varsler',
  title: 'Varsler widget',
  visible: true,
  options: {}
}]

const defaultConfig = {
  cols: { lg: 12, md: 3, sm: 1 },
  breakpoints: { lg: 992, md: 768, sm: 0 },
  margin: [10, 10],
  containerPadding: [10, 10],
  rowHeight: 30,
  defaultTabIndex: 0,
  version: 1
}

const allowedWidgets = ['buc', 'varsler', 'overview']

export interface IndexPageSelector {
  highContrast: boolean
  mode: BUCMode
  username: string | undefined
}

const CustomDashboard = styled(Dashboard)`
   max-width: 1440px;
   flex: 1 1 auto;
   position: relative;
   margin: 0 auto;
   width: 100%;
   padding: 0rem 1rem;
`
const mapState = (state: State): IndexPageSelector => ({
  highContrast: state.ui.highContrast,
  mode: state.buc.mode,
  username: state.app.username
})

export const IndexPage: React.FC<IndexPageProps> = (): JSX.Element => {
  const { highContrast, username, mode }: IndexPageSelector = useSelector<State, IndexPageSelector>(mapState)

  const [loggedTime] = useState<Date>(new Date())

  useEffect(() => {
    return () => {
      timeLogger('view', loggedTime)
    }
  }, [loggedTime])

  return (
    <TopContainer>
      <ContextBanner
        mode={mode}
        highContrast={highContrast}
      />
      <CustomDashboard
        id='eessi-pensjon-ui-fss'
        configurable
        extraWidgets={extraWidgets}
        defaultWidgets={username === 'Z990706' ? defaultWidgetsWithVarsel : defaultWidgets}
        defaultLayouts={username === 'Z990706' ? defaultLayoutsWithVarsel : defaultLayouts}
        defaultConfig={defaultConfig}
        allowedWidgets={allowedWidgets}
        highContrast={highContrast}
      />
    </TopContainer>
  )
}

export default IndexPage
