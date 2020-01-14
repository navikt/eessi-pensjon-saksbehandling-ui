import * as appActions from 'actions/app'
import classNames from 'classnames'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { bindActionCreators, connect } from 'store'
import { ActionCreators, AllowedLocaleString, Dispatch, State, T } from 'types.d'
import './Overview.css'
import PersonPanel from './PersonPanel'
import PersonTitle from './PersonTitle'

export interface OverviewProps {
  actions: ActionCreators;
  aktoerId: string | undefined;
  gettingPersonInfo: boolean;
  highContrast: boolean;
  locale: AllowedLocaleString;
  onUpdate: Function;
  t: T;
  widget: any;
}

const mapStateToProps = (state: State) => {
  /* istanbul ignore next */
  return {
    aktoerId: state.app.params.aktoerId,
    gettingPersonInfo: state.loading.gettingPersonInfo,
    isSendingPinfo: state.loading.isSendingPinfo,
    locale: state.ui.locale,
    person: state.app.person,
    sakId: state.app.params.sakId,
    highContrast: state.ui.highContrast
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  /* istanbul ignore next */
  return { actions: bindActionCreators({ ...appActions }, dispatch) }
}

export const Overview = (props: OverviewProps) => {
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
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  hihContrast: PT.bool,
  onUpdate: PT.func.isRequired,
  widget: PT.object.isRequired,
  t: PT.func.isRequired
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Overview))
