import React from 'react'
import PT from 'prop-types'
import ReactTooltip from 'react-tooltip'
import { connect } from 'store'
import { withTranslation } from 'react-i18next'
import TopContainer from 'components/TopContainer/TopContainer'
import { Dashboard } from 'eessi-pensjon-ui'
import * as extraWidgets from 'widgets'
import './IndexPage.css'

const defaultLayout = [{
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

const defaultLayoutWithVarsel = [{
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

const defaultWidgets = [{
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
  options: {}
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

const mapStateToProps = (state) => ({
  username: state.app.username
})

export const IndexPage = ({ history, t, username }) => {
  const afterLayoutChange = () => {
    ReactTooltip.rebuild()
  }
  return (
    <TopContainer
      className='p-indexPage'
      t={t}
      history={history}
    >
      <ReactTooltip place='top' type='dark' effect='solid' />
      <Dashboard
        id='eessi-pensjon-ui-fss'
        extraWidgets={extraWidgets}
        defaultWidgets={defaultWidgets}
        defaultLayout={username === 'Z990706' ? defaultLayoutWithVarsel : defaultLayout}
        defaultConfig={defaultConfig}
        allowedWidgets={allowedWidgets}
        afterLayoutChange={afterLayoutChange}
      />
    </TopContainer>
  )
}

IndexPage.propTypes = {
  history: PT.object.isRequired,
  t: PT.func.isRequired,
  username: PT.string
}

export default connect(mapStateToProps, () => {})(withTranslation()(IndexPage))
