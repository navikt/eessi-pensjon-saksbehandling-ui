import Journalføring from './Journalføring'
import { WidgetPropType } from 'declarations/Dashboard.pt'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { standardLogger, timeDiffLogger } from 'metrics/loggers'
import { Widget } from 'nav-dashboard'
import { Accordion, Alert, Heading, Panel } from '@navikt/ds-react'
import PT from 'prop-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

export interface JournalføringIndexSelector {
  aktoerId: string | null | undefined
}

export interface JournalføringIndexProps {
  onUpdate?: (w: Widget) => void
  widget: Widget
}

const mapState = (state: State): JournalføringIndexSelector => ({
  /* istanbul ignore next */
  aktoerId: state.app.params.aktoerId
})

export const JournalføringIndex: React.FC<JournalføringIndexProps> = ({
  onUpdate,
  widget
}: JournalføringIndexProps): JSX.Element => {
  const { aktoerId }: JournalføringIndexSelector = useSelector<State, JournalføringIndexSelector>(mapState)
  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    return () => {
      timeDiffLogger('journalføring.mouseover', totalTimeWithMouseOver)
    }
  }, [])

  const { t } = useTranslation()

  const onClick = (): void => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.collapsed = !newWidget.options.collapsed
    standardLogger('journalføring.ekspandpanel.clicked')
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

  if (!aktoerId) {
    return (
      <Alert
        variant='warning'
        data-test-id='w-overview__alert'
      >
        {t('message:validation-noAktoerId')}
      </Alert>
    )
  }

  return (
    <Panel border style={{ padding: '0px' }}
       onMouseEnter={onMouseEnter}
       onMouseLeave={onMouseLeave}
    >
      <Accordion id='w-journalføring-id'>
        <Accordion.Item open={!widget.options.collapsed}>
          <Accordion.Header onClick={onClick}>

            <Heading size='medium'>{t('jou:title')}</Heading>
          </Accordion.Header>
          <Accordion.Content>
            <Journalføring />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Panel>
  )
}

JournalføringIndex.propTypes = {
  onUpdate: PT.func,
  widget: WidgetPropType.isRequired
}

export default JournalføringIndex
