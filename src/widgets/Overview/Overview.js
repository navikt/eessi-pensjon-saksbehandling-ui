import React, { useState, useEffect, useCallback } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect, bindActionCreators } from 'store'
import * as appActions from 'actions/app'
import * as storageActions from 'actions/storage'
import * as pinfoActions from 'actions/pinfo'
import { EkspanderbartpanelBase, Panel, Systemtittel, Tabs } from 'components/Nav'
import { getDisplayName } from 'utils/displayName'
import PersonPanel from './PersonPanel'
import VarslerPanel from './VarslerPanel'

import './Overview.css'

const mapStateToProps = (state) => {
  return {
    aktoerId: state.app.params.aktoerId,
    fileList: state.storage.fileList,
    file: state.storage.file,
    gettingPersonInfo: state.loading.gettingPersonInfo,
    invite: state.pinfo.invite,
    isSendingPinfo: state.loading.isSendingPinfo,
    isInvitingPinfo: state.loading.isInvitingPinfo,
    locale: state.ui.locale,
    person: state.app.person,
    sakId: state.app.params.sakId,
    sakType: state.app.params.sakType
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({ ...appActions, ...pinfoActions, ...storageActions }, dispatch) }
}

export const Overview = (props) => {
  const { actions, aktoerId, onUpdate, t, widget } = props
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted && aktoerId) {
      actions.getPersonInfo(aktoerId)
      setMounted(true)
    }
  }, [mounted, actions, aktoerId])

  const onExpandablePanelChange = () => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.collapsed = !newWidget.options.collapsed
    onUpdate(newWidget)
  }

  const onTabChanged = useCallback((e, i) => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.tabIndex = i
    onUpdate(newWidget)
  }, [onUpdate, widget])

  return (
    <EkspanderbartpanelBase
      className='w-overview s-border'
      apen={!widget.options.collapsed}
      onClick={onExpandablePanelChange}
      heading={<Systemtittel className='p-2'>{t('ui:widget-overview')}</Systemtittel>}
    >
      <Tabs
        tabs={[
          { label: t('ui:widget-overview-userDetails') },
          { label: t('ui:widget-overview-notifications') }
        ]}
        onChange={onTabChanged}
      />
      {widget.options.tabIndex === undefined || widget.options.tabIndex === 0 ? (
        <Panel>
          <PersonPanel {...props} />
        </Panel>
      ) : null}
      {widget.options.tabIndex === 1 ? (
        <Panel>
          <VarslerPanel {...props} />
        </Panel>
      ) : null}
    </EkspanderbartpanelBase>
  )
}

Overview.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  onUpdate: PT.string.isRequired,
  t: PT.func.isRequired,
  widget: PT.object.isRequired
}

const ConnectedOverview = connect(mapStateToProps, mapDispatchToProps)(Overview)
ConnectedOverview.displayName = `Connect(${getDisplayName(Overview)})`
export default ConnectedOverview
