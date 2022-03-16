import { readNotification } from 'actions/pagenotification'
import ContextBanner from 'components/ContextBanner/ContextBanner'
import Modal from 'components/Modal/Modal'
import TopContainer from 'components/TopContainer/TopContainer'
import { BUCMode, FeatureToggles } from 'declarations/app'
import { State } from 'declarations/reducers'
import { timeLogger } from 'metrics/loggers'
import Dashboard, { LayoutTabs, Widgets } from '@navikt/dashboard'
import { BodyLong } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import * as extraWidgets from 'widgets'
import { VerticalSeparatorDiv } from '@navikt/hoykontrast'

const CustomDashboard = styled(Dashboard)`
   flex: 1 1 auto;
   position: relative;
   margin: 0 auto;
   width: 100%;
   padding: 0rem 1rem;
`

export interface IndexPageProps {
  username?: string
}

const defaultLayouts: LayoutTabs = [{
  label: 'default',
  body: {
    lg: [
      { i: 'w-1-overview', x: 0, y: 0, w: 12, h: 2, minW: 6, maxW: 12, minH: 2, maxH: 999 },
      { i: 'w-2-buc', x: 0, y: 1, w: 12, h: 6, minW: 6, maxW: 12, minH: 2, maxH: 999 }
    ],
    md: [
      { i: 'w-1-overview', x: 0, y: 0, w: 3, h: 2, minW: 2, maxW: 3, minH: 2, maxH: 999 },
      { i: 'w-2-buc', x: 0, y: 1, w: 3, h: 6, minW: 2, maxW: 3, minH: 2, maxH: 999 }
    ],
    sm: [
      { i: 'w-1-overview', x: 0, y: 0, w: 1, h: 2, minW: 1, maxW: 1, minH: 2, maxH: 999 },
      { i: 'w-2-buc', x: 0, y: 1, w: 1, h: 6, minW: 1, maxW: 1, minH: 2, maxH: 999 }
    ]
  }
}]

const defaultLayoutsWithOthers: LayoutTabs = [{
  label: 'default',
  body: {
    lg: [
      { i: 'w-1-overview', x: 0, y: 0, w: 12, h: 2, minW: 6, maxW: 12, minH: 2, maxH: 999 },
      { i: 'w-3-journalføring', x: 0, y: 1, w: 4, h: 1, minW: 2, maxW: 12, minH: 1, maxH: 999 },
      { i: 'w-4-pagenotification', x: 4, y: 1, w: 4, h: 1, minW: 2, maxW: 12, minH: 1, maxH: 999 },
      { i: 'w-5-s3inventory', x: 8, y: 1, w: 4, h: 1, minW: 2, maxW: 12, minH: 1, maxH: 999 },
      { i: 'w-2-buc', x: 0, y: 2, w: 12, h: 6, minW: 6, maxW: 12, minH: 1, maxH: 999 }
    ],
    md: [
      { i: 'w-1-overview', x: 0, y: 0, w: 3, h: 2, minW: 2, maxW: 3, minH: 2, maxH: 999 },
      { i: 'w-3-journalføring', x: 0, y: 1, w: 1, h: 1, minW: 1, maxW: 3, minH: 1, maxH: 999 },
      { i: 'w-4-pagenotification', x: 1, y: 1, w: 1, h: 1, minW: 1, maxW: 3, minH: 1, maxH: 999 },
      { i: 'w-5-s3inventory', x: 2, y: 1, w: 1, h: 1, minW: 1, maxW: 3, minH: 1, maxH: 999 },
      { i: 'w-2-buc', x: 0, y: 2, w: 3, h: 6, minW: 2, maxW: 3, minH: 2, maxH: 999 }
    ],
    sm: [
      { i: 'w-1-overview', x: 0, y: 0, w: 1, h: 2, minW: 1, maxW: 1, minH: 2, maxH: 999 },
      { i: 'w-3-journalføring', x: 0, y: 1, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 999 },
      { i: 'w-4-pagenotification', x: 0, y: 2, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 999 },
      { i: 'w-5-s3inventory', x: 0, y: 3, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 999 },
      { i: 'w-2-buc', x: 0, y: 4, w: 1, h: 6, minW: 1, maxW: 1, minH: 2, maxH: 999 }
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
  i: 'w-3-journalføring',
  type: 'journalføring',
  title: 'Journalføring widget',
  visible: true,
  options: {
    collapsed: true
  }
}, {
  i: 'w-4-pagenotification',
  type: 'pagenotification',
  title: 'Page notification widget',
  visible: true,
  options: {
    collapsed: true
  }
}, {
  i: 'w-5-s3inventory',
  type: 's3inventory',
  title: 'S3 inventory widget',
  visible: true,
  options: {
    collapsed: true
  }
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

export interface IndexPageSelector {
  featureToggles: FeatureToggles
  mode: BUCMode
  username: string | undefined
  message: string | null | undefined
  show: boolean | undefined
  byline: string | null | undefined
}

const mapState = (state: State): IndexPageSelector => ({
  featureToggles: state.app.featureToggles,
  mode: state.buc.mode,
  username: state.app.username,
  message: state.pagenotification.message,
  show: state.pagenotification.show,
  byline: state.pagenotification.byline

})

export const IndexPage: React.FC<IndexPageProps> = (): JSX.Element => {
  const { featureToggles, mode, message, show, byline }: IndexPageSelector = useSelector<State, IndexPageSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [displayedMessage, setDisplayedMessage] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [loggedTime] = useState<Date>(new Date())

  useEffect(() => {
    dispatch(readNotification())
  }, [])

  useEffect(() => {
    if (!displayedMessage && message) {
      setShowModal(true)
      setDisplayedMessage(true)
    }
  }, [message, displayedMessage])

  useEffect(() => {
    return () => {
      timeLogger('view', loggedTime)
    }
  }, [loggedTime])

  const allowedWidgets = featureToggles.ADMIN_NOTIFICATION_MESSAGE
    ? ['buc', 'overview', 'journalføring', 'pagenotification', 's3inventory']
    : ['buc', 'overview']

  return (
    <TopContainer>
      <Modal
        open={showModal && !!show}
        modal={{
          modalTitle: t('ui:notification'),
          modalContent: (
            <div style={{ padding: '2rem', minWidth: '400px', textAlign: 'center' }}>
              <BodyLong>
                {message}
              </BodyLong>
              <VerticalSeparatorDiv />
              <BodyLong>
                {byline}
              </BodyLong>
            </div>
          ),
          modalButtons: [{
            main: true,
            text: 'OK',
            onClick: () => setShowModal(false)
          }]
        }}
        onModalClose={() => setShowModal(false)}
      />
      <ContextBanner mode={mode} />
      <CustomDashboard
        id='eessi-pensjon-ui-fss'
        configurable
        extraWidgets={extraWidgets}
        defaultWidgets={defaultWidgets}
        defaultLayouts={featureToggles.ADMIN_NOTIFICATION_MESSAGE ? defaultLayoutsWithOthers : defaultLayouts}
        defaultConfig={defaultConfig}
        allowedWidgets={allowedWidgets}
      />
    </TopContainer>
  )
}

export default IndexPage
