import { Accordion, Alert, Heading, Panel } from '@navikt/ds-react'
import { State } from 'declarations/reducers'
import { timeDiffLogger } from 'metrics/loggers'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Journalføring from './Journalføring'

export interface JournalføringIndexSelector {
  aktoerId: string | null | undefined
}

const mapState = (state: State): JournalføringIndexSelector => ({
  /* istanbul ignore next */
  aktoerId: state.app.params.aktoerId
})

const JournalføringIndex = (): JSX.Element => {
  const { aktoerId }: JournalføringIndexSelector = useSelector<State, JournalføringIndexSelector>(mapState)
  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    return () => {
      timeDiffLogger('journalføring.mouseover', totalTimeWithMouseOver)
    }
  }, [])

  const { t } = useTranslation()

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
        data-testid='w-overview--alert'
      >
        {t('message:validation-noAktoerId')}
      </Alert>
    )
  }

  return (
    <Panel
      border style={{ padding: '0px' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Accordion id='w-journalføring-id'>
        <Accordion.Item>
          <Accordion.Header>
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

export default JournalføringIndex
