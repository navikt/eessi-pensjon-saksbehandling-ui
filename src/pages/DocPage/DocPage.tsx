import TopContainer from 'components/TopContainer/TopContainer'
import { timeLogger } from 'metrics/loggers'
import Dashboard, { LayoutTabs, Widgets } from '@navikt/dashboard'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import * as extraWidgets from 'widgets'

const CustomDashboard = styled(Dashboard)`
   max-width: 1440px;
   flex: 1 1 auto;
   position: relative;
   margin: 0 auto;
   width: 100%;
   padding: 0rem 1rem;
`

export interface DocPageProps {
  username?: string
}

const defaultLayouts: LayoutTabs = [{
  label: 'default',
  body: {
    lg: [
      { i: 'w-1-doc', x: 0, y: 0, w: 12, h: 6, minW: 6, maxW: 12, minH: 2, maxH: 999 }
    ],
    md: [
      { i: 'w-1-doc', x: 0, y: 2, w: 3, h: 6, minW: 2, maxW: 3, minH: 2, maxH: 999 }
    ],
    sm: [
      { i: 'w-1-doc', x: 0, y: 2, w: 1, h: 6, minW: 1, maxW: 1, minH: 2, maxH: 999 }
    ]
  }
}]

const defaultWidgets: Widgets = [{
  i: 'w-1-doc',
  type: 'doc',
  title: 'Doc widget',
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

const allowedWidgets = ['doc']

export const DocPage: React.FC<DocPageProps> = (): JSX.Element => {
  const [loggedTime] = useState<Date>(new Date())

  useEffect(() => {
    return () => {
      timeLogger('view', loggedTime)
    }
  }, [loggedTime])

  return (
    <TopContainer>
      <CustomDashboard
        id='eessi-pensjon-ui-fss-doc'
        configurable
        extraWidgets={extraWidgets}
        defaultWidgets={defaultWidgets}
        defaultLayouts={defaultLayouts}
        defaultConfig={defaultConfig}
        allowedWidgets={allowedWidgets}
      />
    </TopContainer>
  )
}

export default DocPage
