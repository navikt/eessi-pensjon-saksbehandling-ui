import { getPersonInfo } from 'actions/app'
import classNames from 'classnames'
import { WidgetPropType } from 'declarations/Dashboard.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import { Widget } from 'eessi-pensjon-ui/dist/declarations/Dashboard.d'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import './Overview.css'
import PersonPanel from './PersonPanel'
import PersonTitle from './PersonTitle'

const mapState = (state: State): OverviewSelector => ({
  /* istanbul ignore next */
  aktoerId: state.app.params.aktoerId,
  gettingPersonInfo: state.loading.gettingPersonInfo,
  locale: state.ui.locale,
  person: state.app.person,
  highContrast: state.ui.highContrast
})

export interface OverviewSelector {
  aktoerId: string;
  gettingPersonInfo: boolean;
  locale: AllowedLocaleString;
  person: any;
  highContrast: boolean;
}

export interface OverviewProps {
  onUpdate?: (w: Widget) => void;
  skipMount?: boolean;
  widget: Widget;
}

export const Overview: React.FC<OverviewProps> = ({ onUpdate, skipMount = false, widget }: OverviewProps): JSX.Element => {
  const [mounted, setMounted] = useState<boolean>(skipMount)
  const { aktoerId, gettingPersonInfo, locale, person, highContrast }: OverviewSelector = useSelector<State, OverviewSelector>(mapState)

  const dispatch = useDispatch()
  const { t } = useTranslation()

  useEffect(() => {
    if (!mounted && aktoerId) {
      dispatch(getPersonInfo(aktoerId))
      setMounted(true)
    }
  }, [mounted, dispatch, aktoerId])

  const onExpandablePanelChange = (): void => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.collapsed = !newWidget.options.collapsed
    if (onUpdate) {
      onUpdate(newWidget)
    }
  }

  if (!aktoerId) {
    return (
      <Ui.Nav.AlertStripe type='advarsel' className='w-overview__alert w-100'>
        {t('buc:validation-noAktoerId')}
      </Ui.Nav.AlertStripe>
    )
  }

  return (
    <Ui.ExpandingPanel
      collapseProps={{ id: 'w-overview-id' }}
      className={classNames('w-overview', 's-border', { highContrast: highContrast })}
      open={!widget.options.collapsed}
      onClick={onExpandablePanelChange}
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
      />
    </Ui.ExpandingPanel>
  )
}

Overview.propTypes = {
  onUpdate: PT.func,
  skipMount: PT.bool,
  widget: WidgetPropType.isRequired
}

export default Overview
