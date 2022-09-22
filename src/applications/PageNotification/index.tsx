import PageNotification from './PageNotification'
import { WidgetPropType } from 'declarations/dashboard.pt'
import _ from 'lodash'
import { standardLogger, timeDiffLogger } from 'metrics/loggers'
import { Widget } from '@navikt/dashboard'
import { Alert, Accordion, Heading, Panel } from '@navikt/ds-react'
import PT from 'prop-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

export const MyAlertStripe = styled(Alert)`
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

  const onClick = (): void => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.collapsed = !newWidget.options.collapsed
    standardLogger('pagenotification.ekspandpanel.clicked')
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
    <Panel
      border style={{ padding: '0px' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Accordion data-testid='w-pagenotification-id'>
        <Accordion.Item open={!widget.options.collapsed}>
          <Accordion.Header onClick={onClick}>
            <Heading size='medium'>{t('ui:page-notification-title')}</Heading>
          </Accordion.Header>
          <Accordion.Content>
            <PageNotification />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Panel>
  )
}

PageNotificationIndex.propTypes = {
  onUpdate: PT.func,
  widget: WidgetPropType.isRequired
}

export default PageNotificationIndex
