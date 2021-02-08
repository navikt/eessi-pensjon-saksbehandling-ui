import { getPersonAvdodInfo, getPersonInfo } from 'actions/app'
import classNames from 'classnames'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import * as constants from 'constants/constants'
import { WidgetPropType } from 'declarations/Dashboard.pt'
import { PersonPDL } from 'declarations/person'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, FeatureToggles, PesysContext } from 'declarations/app.d'
import { PersonAvdodsPDL } from 'declarations/person.d'
import _ from 'lodash'
import { standardLogger, timeDiffLogger } from 'metrics/loggers'
import { Widget } from 'nav-dashboard'
import Alertstripe from 'nav-frontend-alertstriper'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import PersonPanel from './PersonPanel'
import PersonTitle from './PersonTitle'
import NavHighContrast from 'nav-hoykontrast'

export const Alert = styled(Alertstripe)`
  width: 100%
`

export interface OverviewSelector {
  aktoerId: string
  featureToggles: FeatureToggles
  gettingPersonInfo: boolean
  locale: AllowedLocaleString
  person?: PersonPDL,
  personAvdods: PersonAvdodsPDL | undefined,
  pesysContext: PesysContext | undefined,
  vedtakId: string
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
  highContrast: boolean
  onUpdate?: (w: Widget) => void
  skipMount?: boolean
  widget: Widget
}

export const Overview: React.FC<OverviewProps> = ({
  highContrast,
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

  const onExpandablePanelClosing = (): void => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.collapsed = true
    standardLogger('overview.ekspandpanel.close')
    if (onUpdate) {
      onUpdate(newWidget)
    }
  }

  const onExpandablePanelOpening = (): void => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.collapsed = false
    standardLogger('overview.ekspandpanel.open')
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
        type='advarsel'
        data-test-id='w-overview__alert'
      >
        {t('buc:validation-noAktoerId')}
      </Alert>
    )
  }

  return (
    <NavHighContrast highContrast={highContrast}>
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <ExpandingPanel
          highContrast={highContrast}
          collapseProps={{ id: 'w-overview-id' }}
          className={classNames({ highContrast: highContrast })}
          data-test-id='w-overview-id'
          open={!widget.options.collapsed}
          onOpen={onExpandablePanelOpening}
          onClose={onExpandablePanelClosing}
          heading={(
            <PersonTitle
              gettingPersonInfo={gettingPersonInfo}
              person={person}
            />
          )}
        >
          <PersonPanel
            highContrast={highContrast}
            locale={locale}
            person={person}
            personAvdods={personAvdods}
          />
        </ExpandingPanel>
      </div>
    </NavHighContrast>
  )
}

Overview.propTypes = {
  onUpdate: PT.func,
  skipMount: PT.bool,
  widget: WidgetPropType.isRequired
}

export default Overview
