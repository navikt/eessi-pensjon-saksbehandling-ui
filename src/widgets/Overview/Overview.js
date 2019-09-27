import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect, bindActionCreators } from 'store'
import * as appActions from 'actions/app'
import { Nav } from 'eessi-pensjon-ui'
import { getDisplayName } from 'utils/displayName'
import PersonTitle from './PersonTitle'
import PersonPanel from './PersonPanel'

import './Overview.css'

const mapStateToProps = (state) => {
  return {
    aktoerId: state.app.params.aktoerId,
    gettingPersonInfo: state.loading.gettingPersonInfo,
    isSendingPinfo: state.loading.isSendingPinfo,
    locale: state.ui.locale,
    person: state.app.person,
    sakId: state.app.params.sakId
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({ ...appActions }, dispatch) }
}

export const Overview = (props) => {
  const { actions, aktoerId, onUpdate, widget } = props
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

  return (
    <Nav.EkspanderbartpanelBase
      className='w-overview s-border'
      apen={!widget.options.collapsed}
      onClick={onExpandablePanelChange}
      heading={<PersonTitle {...props} />}
    >
      <PersonPanel {...props} />
    </Nav.EkspanderbartpanelBase>
  )
}

Overview.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  onUpdate: PT.func.isRequired,
  widget: PT.object.isRequired
}

const ConnectedOverview = connect(mapStateToProps, mapDispatchToProps)(Overview)
ConnectedOverview.displayName = `Connect(${getDisplayName(Overview)})`
export default ConnectedOverview
