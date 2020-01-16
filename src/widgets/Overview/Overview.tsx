import * as appActions from 'actions/app'
import classNames from 'classnames'
import { ActionCreatorsPropType, TPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import { Widget } from 'eessi-pensjon-ui/dist/declarations/Dashboard.d'
import { WidgetPropType } from 'declarations/Dashboard.pt'
import { ActionCreators, Dispatch, State } from 'eessi-pensjon-ui/dist/declarations/types'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { bindActionCreators, connect } from 'store'
import { AllowedLocaleString, T } from 'declarations/types'
import './Overview.css'
import PersonPanel from './PersonPanel'
import PersonTitle from './PersonTitle'

const mapStateToProps = (state: State) => ({
  /* istanbul ignore next */
  aktoerId: state.app.params.aktoerId,
  gettingPersonInfo: state.loading.gettingPersonInfo,
  isSendingPinfo: state.loading.isSendingPinfo,
  locale: state.ui.locale,
  person: state.app.person,
  sakId: state.app.params.sakId,
  highContrast: state.ui.highContrast
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  /* istanbul ignore next */
  actions: bindActionCreators({ ...appActions }, dispatch)
})

export interface OverviewProps {
  actions: ActionCreators;
  aktoerId: string | undefined;
  gettingPersonInfo: boolean;
  highContrast: boolean;
  locale: AllowedLocaleString;
  onUpdate: (w: Widget) => void;
  person: any;
  t: T;
  widget: Widget;
}

export const Overview: React.FC<OverviewProps> = (props: OverviewProps): JSX.Element => {
  const { actions, aktoerId, highContrast, onUpdate, t, widget } = props
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    if (!mounted && aktoerId) {
      actions.getPersonInfo(aktoerId)
      setMounted(true)
    }
  }, [mounted, actions, aktoerId])

  const onExpandablePanelChange = (): void => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.collapsed = !newWidget.options.collapsed
    onUpdate(newWidget)
  }

  if (!aktoerId) {
    return (
      <Ui.Nav.AlertStripe type='advarsel' className='w-overview__alert w-100'>
        {t('buc:validation-noAktoerId')}
      </Ui.Nav.AlertStripe>
    )
  }

  return (
    <Ui.Nav.EkspanderbartpanelBase
      collapseProps={{ id: 'w-overview-id' }}
      className={classNames('w-overview', 's-border', { highContrast: highContrast })}
      apen={!widget.options.collapsed}
      onClick={onExpandablePanelChange}
      heading={<PersonTitle {...props} />}
    >
      <PersonPanel {...props} />
    </Ui.Nav.EkspanderbartpanelBase>
  )
}

Overview.propTypes = {
  actions: ActionCreatorsPropType.isRequired,
  aktoerId: PT.string,
  gettingPersonInfo: PT.bool.isRequired,
  highContrast: PT.bool.isRequired,
  onUpdate: PT.func.isRequired,
  person: PT.any.isRequired,
  widget: WidgetPropType.isRequired,
  t: TPropType.isRequired
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Overview))
