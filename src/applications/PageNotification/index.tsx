import { Accordion, Heading, Panel } from '@navikt/ds-react'
import { timeDiffLogger } from 'metrics/loggers'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageNotification from './PageNotification'

export const PageNotificationIndex = (): JSX.Element => {
  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    return () => {
      timeDiffLogger('pagenotification.mouseover', totalTimeWithMouseOver)
    }
  }, [])

  const { t } = useTranslation()

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
        <Accordion.Item>
          <Accordion.Header>
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

export default PageNotificationIndex
