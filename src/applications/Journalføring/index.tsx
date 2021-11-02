import { Systemtittel } from 'nav-frontend-typografi'
import Journalføring from './Journalføring'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import { WidgetPropType } from 'declarations/Dashboard.pt'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { standardLogger, timeDiffLogger } from 'metrics/loggers'
import { Widget } from 'nav-dashboard'
import Alertstripe from 'nav-frontend-alertstriper'
import PT from 'prop-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

export const MyAlertStripe = styled(Alertstripe)`
  width: 100%;
`

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

  const onExpandablePanelClosing = (): void => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.collapsed = true
    standardLogger('journalføring.ekspandpanel.close')
    if (onUpdate) {
      onUpdate(newWidget)
    }
  }

  const onExpandablePanelOpening = (): void => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.collapsed = false
    standardLogger('journalføring.ekspandpanel.open')
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
      <MyAlertStripe
        type='advarsel'
        data-test-id='w-overview__alert'
      >
        {t('buc:validation-noAktoerId')}
      </MyAlertStripe>
    )
  }

  return (

    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ExpandingPanel
        collapseProps={{ id: 'w-journalføring-id' }}
        data-test-id='w-journalføring-id'
        open={!widget.options.collapsed}
        onOpen={onExpandablePanelOpening}
        onClose={onExpandablePanelClosing}
        heading={(
          <Systemtittel>{t('jou:title')}</Systemtittel>
        )}
      >
        <Journalføring />
      </ExpandingPanel>
    </div>
  )
}

JournalføringIndex.propTypes = {
  onUpdate: PT.func,
  widget: WidgetPropType.isRequired
}

export default JournalføringIndex
