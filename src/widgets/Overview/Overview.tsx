import { getPersonAvdodInfo, getPersonInfo } from 'actions/app'
import * as constants from 'constants/constants'
import { AllowedLocaleString, FeatureToggles, PesysContext } from 'declarations/app.d'
import { WidgetPropType } from 'declarations/dashboard.pt'
import { PersonPDL } from 'declarations/person'
import { PersonAvdods } from 'declarations/person.d'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { standardLogger, timeDiffLogger } from 'metrics/loggers'
import { Widget } from 'nav-dashboard'
import { Accordion, Alert, Panel } from '@navikt/ds-react'
import PT from 'prop-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import PersonPanel from './PersonPanel'
import PersonTitle from './PersonTitle'

export const MyAlertStripe = styled(Alert)`
  width: 100%
`

export interface OverviewSelector {
  aktoerId: string | null | undefined
  featureToggles: FeatureToggles
  gettingPersonInfo: boolean
  locale: AllowedLocaleString
  person?: PersonPDL,
  personAvdods: PersonAvdods | undefined,
  pesysContext: PesysContext | undefined,
  vedtakId: string | null | undefined
}

const mapState = (state: State): OverviewSelector => ({
  /* istanbul ignore next */
  aktoerId: state.app.params.aktoerId,
  featureToggles: state.app.featureToggles,
  gettingPersonInfo: state.loading.gettingPersonInfo,
  locale: state.ui.locale,
  person: state.app.person,
  personAvdods: state.app.personAvdods,
  pesysContext: state.app.pesysContext,
  vedtakId: state.app.params.vedtakId
})

export interface OverviewProps {
  onUpdate?: (w: Widget) => void
  skipMount?: boolean
  widget: Widget
}

export const Overview: React.FC<OverviewProps> = ({
  onUpdate,
  skipMount = false,
  widget
}: OverviewProps): JSX.Element => {
  const [mounted, setMounted] = useState<boolean>(skipMount)
  const { aktoerId, featureToggles, gettingPersonInfo, locale, person, personAvdods, pesysContext, vedtakId }: OverviewSelector =
    useSelector<State, OverviewSelector>(mapState)
  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    return () => {
      timeDiffLogger('overview.mouseover', totalTimeWithMouseOver)
    }
  }, [])

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const onClick = () => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.collapsed = !newWidget.options.collapsed
    standardLogger('overview.ekspandpanel.click')
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

  useEffect(() => {
    if (!mounted && aktoerId && pesysContext) {
      if (!person) {
        dispatch(getPersonInfo(aktoerId))
        if (pesysContext === constants.VEDTAKSKONTEKST) {
          dispatch(getPersonAvdodInfo(aktoerId, vedtakId, featureToggles.NR_AVDOD))
        }
      }
      setMounted(true)
    }
  }, [featureToggles, mounted, dispatch, aktoerId, person, pesysContext, vedtakId])

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

    <Panel
      border style={{ padding: '0px' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Accordion style={{ borderRadius: '4px' }} data-test-id='w-overview-id'>
        <Accordion.Item open={!widget.options.collapsed}>
          <Accordion.Header onClick={onClick}>
            <PersonTitle
              gettingPersonInfo={gettingPersonInfo}
              person={person}
            />
          </Accordion.Header>
          <Accordion.Content>
            <PersonPanel
              locale={locale}
              person={person}
              personAvdods={personAvdods}
            />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Panel>
  )
}

Overview.propTypes = {
  onUpdate: PT.func,
  skipMount: PT.bool,
  widget: WidgetPropType.isRequired
}

export default Overview
