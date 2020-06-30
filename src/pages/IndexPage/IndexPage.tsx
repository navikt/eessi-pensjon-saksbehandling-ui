import { BUCMode } from 'applications/BUC'
import Icons from 'components/Icons/Icons'
import TopContainer from 'components/TopContainer/TopContainer'
import Dashboard, { LayoutTabs, Widgets } from 'nav-dashboard'
import Lenke from 'nav-frontend-lenker'
import { linkLogger, timeLogger } from 'metrics/loggers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { State } from 'declarations/reducers'
import * as extraWidgets from 'widgets'
import styled from 'styled-components'
import ExternalLink from 'assets/icons/line-version-logout'
import 'rc-tooltip/assets/bootstrap_white.css'

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
  breakpoints: { lg: 900, md: 600, sm: 0 },
  margin: [10, 10],
  containerPadding: [10, 10],
  rowHeight: 30,
  defaultTabIndex: 0,
  version: 1
}

const allowedWidgets = ['buc', 'varsler', 'overview']

export interface IndexPageSelector {
  username: string | undefined,
  mode: BUCMode
}

const mapState = (state: State): IndexPageSelector => ({
  username: state.app.username,
  mode: state.buc.mode
})

const DivWithLinks = styled.div`
     padding: 0.5rem 2rem;
     background-color: #E9E7E7;
     display: flex;
     flex-direction: row-reverse;
  `
const SeparatorSpan = styled.span`
     padding: 0rem 0.5rem
  `
export const IndexPage: React.FC<IndexPageProps> = (): JSX.Element => {
  const { username, mode }: IndexPageSelector = useSelector<State, IndexPageSelector>(mapState)
  const { t } = useTranslation()
  const [loggedTime] = useState<Date>(new Date())

  useEffect(() => {
    return () => {
      timeLogger('view', loggedTime)
    }
  }, [loggedTime])

  return (
    <TopContainer>
      <DivWithLinks>
        <Lenke
          target='_blank'
          data-amplitude='links.rettskilder'
          href='https://lovdata.no/pro/#document/NAV/rundskriv/v2-45-03'
          onClick={(e: React.MouseEvent) => linkLogger(e, { mode: mode })}
        >
          <ExternalLink Icons className='mr-2' color='#0067C5'  />
          {t('ui:lawsource')}
        </Lenke>
        <SeparatorSpan>
          •
        </SeparatorSpan>
        <Lenke
          target='_blank'
          data-amplitude='links.hjelpe'
          href='https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Pensjon-.aspx'
          onClick={(e: React.MouseEvent) => linkLogger(e, { mode: mode })}
        >
          <Icons className='mr-2' color='#0067C5' kind='outlink' />
          {t('ui:help')}
        </Lenke>
      </DivWithLinks>
      <Dashboard
        id='eessi-pensjon-ui-fss'
        extraWidgets={extraWidgets}
        defaultWidgets={username === 'Z990706' ? defaultWidgetsWithVarsel : defaultWidgets}
        defaultLayouts={username === 'Z990706' ? defaultLayoutsWithVarsel : defaultLayouts}
        defaultConfig={defaultConfig}
        allowedWidgets={allowedWidgets}
      />
    </TopContainer>
  )
}

export default IndexPage
