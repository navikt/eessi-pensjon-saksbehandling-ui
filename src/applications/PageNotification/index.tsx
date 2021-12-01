import { Systemtittel } from 'nav-frontend-typografi'
import PageNotification from './PageNotification'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import { WidgetPropType } from 'declarations/Dashboard.pt'
import _ from 'lodash'
import { standardLogger, timeDiffLogger } from 'metrics/loggers'
import { Widget } from 'nav-dashboard'
import Alertstripe from 'nav-frontend-alertstriper'
import PT from 'prop-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export const MyAlertStripe = styled(Alertstripe)`
  width: 100%;
`

export interface PageNotificationIndexSelector {
  aktoerId: string | null | undefined
}

export interface PageNotificationIndexProps {
  onUpdate?: (w: Widget) => void
  widget: Widget
}

export const PageNotificationIndex: React.FC<PageNotificationIndexProps> = ({
  onUpdate,
  widget
}: PageNotificationIndexProps): JSX.Element => {
  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    return () => {
      timeDiffLogger('pagenotification.mouseover', totalTimeWithMouseOver)
    }
  }, [])

  const { t } = useTranslation()

  const onExpandablePanelClosing = (): void => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.collapsed = true
    standardLogger('pagenotification.ekspandpanel.close')
    if (onUpdate) {
      onUpdate(newWidget)
    }
  }

  const onExpandablePanelOpening = (): void => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.collapsed = false
    standardLogger('pagenotification.ekspandpanel.open')
    if (onUpdate) {
      onUpdate(newWidget)
    }
  }

  const onMouseEnter = () => setMouseEnterDate(new Date())

  const onMouseLeave = () => {
    if (mouseEnterDate) {
      setTotalTimeWithMouseOver(totalTimeWithMouseOver + (new Date().getTime() - mouseEnterDate?.getTime()))
    }
  }

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ExpandingPanel
        collapseProps={{ id: 'w-pagenotification-id' }}
        data-test-id='w-pagenotification-id'
        open={!widget.options.collapsed}
        onOpen={onExpandablePanelOpening}
        onClose={onExpandablePanelClosing}
        heading={(
          <Systemtittel>{t('ui:page-notification-title')}</Systemtittel>
        )}
      >
        <PageNotification />
      </ExpandingPanel>
    </div>
  )
}

PageNotificationIndex.propTypes = {
  onUpdate: PT.func,
  widget: WidgetPropType.isRequired
}

export default PageNotificationIndex
