import React, { useState, useEffect, useCallback } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect, bindActionCreators } from 'store'
import * as appActions from 'actions/app'
import { EkspanderbartpanelBase, Systemtittel, Tabs } from 'components/Nav'
import { getDisplayName } from 'utils/displayName'
import PersonPanel from './PersonPanel'
import VarslerPanel from './VarslerPanel'

import './Overview.css'

const mapStateToProps = (state) => {
  return {
    person: state.app.person,
    gettingPersonInfo: state.loading.gettingPersonInfo,
    aktoerId: state.app.params.aktoerId,
    locale: state.ui.locale
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(appActions, dispatch) }
}

export const Overview = (props) => {
  const { actions, aktoerId, gettingPersonInfo, onUpdate, person, t, widget } = props
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
      heading={<Systemtittel className='p-2'>{t('ui:widget-myOverview')}</Systemtittel>}
    >
      <Tabs
        tabs={[
          { label: t('ui:widget-myOverview-userDetails') },
          { label: t('ui:widget-myOverview-notifications') }
        ]}
        onChange={onTabChanged}
      />
      {widget.options.tabIndex === undefined || widget.options.tabIndex === 0 ? (
        <>
          <PersonPanel
            t={t}
            gettingPersonInfo={gettingPersonInfo}
            person={person}
            aktoerId={aktoerId}
          />
        </>
      ) : null}
      {widget.options.tabIndex === 1 ? (
        <>
          <VarslerPanel {...props} />
        </>
      ) : null}
    </EkspanderbartpanelBase>
  )
}

Overview.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  gettingPersonInfo: PT.bool,
  locale: PT.string.isRequired,
  onUpdate: PT.string.isRequired,
  person: PT.object,
  t: PT.func.isRequired
}

const ConnectedOverview = connect(mapStateToProps, mapDispatchToProps)(Overview)
ConnectedOverview.displayName = `Connect(${getDisplayName(Overview)})`
export default ConnectedOverview
