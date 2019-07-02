import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'

import { connect, bindActionCreators } from 'store'
import PersonHeader from './PersonHeader'
import PersonBody from './PersonBody'
import { EkspanderbartpanelBase } from 'components/ui/Nav'
import * as appActions from 'actions/app'
import { getDisplayName } from 'utils/displayName'

import './Person.css'

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

const PersonWidget = (props) => {
  const { actions, aktoerId, gettingPersonInfo, person, t } = props
  const [ mounted, setMounted ] = useState(false)

  useEffect(() => {
    if (!mounted && aktoerId) {
      actions.getPersonInfo(aktoerId)
      setMounted(true)
    }
  }, [mounted, actions, aktoerId])

  return <EkspanderbartpanelBase
    heading={
      <PersonHeader
        t={t} person={person}
        aktoerId={aktoerId}
        gettingPersonInfo={gettingPersonInfo}
      />}>
    <PersonBody t={t} person={person} aktoerId={aktoerId} />
  </EkspanderbartpanelBase>
}

PersonWidget.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  gettingPersonInfo: PT.bool,
  locale: PT.string.isRequired,
  person: PT.object,
  t: PT.func.isRequired
}

const ConnectedPersonWidget = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(PersonWidget))
ConnectedPersonWidget.displayName = `Connect(${getDisplayName(withTranslation()(PersonWidget))})`
export default ConnectedPersonWidget
