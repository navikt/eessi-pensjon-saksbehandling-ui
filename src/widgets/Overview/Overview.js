import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import OverviewHeader from './OverviewHeader'
import OverviewBody from './OverviewBody'
import * as appActions from 'actions/app'
import { EkspanderbartpanelBase } from 'components/Nav'
import { getDisplayName } from 'utils/displayName'

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
  const { actions, aktoerId, gettingPersonInfo, person, t } = props
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted && aktoerId) {
      actions.getPersonInfo(aktoerId)
      setMounted(true)
    }
  }, [mounted, actions, aktoerId])

  return (
    <EkspanderbartpanelBase
      className='w-overview s-border'
      heading={
        <OverviewHeader
          t={t} person={person}
          aktoerId={aktoerId}
          gettingPersonInfo={gettingPersonInfo}
        />
      }
    >
      <OverviewBody t={t} person={person} aktoerId={aktoerId} />
    </EkspanderbartpanelBase>
  )
}

Overview.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  gettingPersonInfo: PT.bool,
  locale: PT.string.isRequired,
  person: PT.object,
  t: PT.func.isRequired
}

const ConnectedOverview = connect(mapStateToProps, mapDispatchToProps)(Overview)
ConnectedOverview.displayName = `Connect(${getDisplayName(Overview)})`
export default ConnectedOverview
