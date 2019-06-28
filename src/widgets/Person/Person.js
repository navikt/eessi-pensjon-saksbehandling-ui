import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'

import PersonHeader from './PersonHeader'
import PersonBody from './PersonBody'
import { Flatknapp, EkspanderbartpanelBase } from 'components/ui/Nav'
import Icons from 'components/ui/Icons'
import countries from 'components/ui/CountrySelect/CountrySelectData'
import * as appActions from 'actions/app'
import './Person.css'
import { getDisplayName } from '../../utils/displayName'

const mapStateToProps = (state) => {
  return {
    person: state.app.person,
    gettingPersonInfo: state.loading.gettingPersonInfo,
    aktoerId: state.app.params.aktoerId,
    rinaUrl: state.buc.rinaUrl,
    locale: state.ui.locale
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(appActions, dispatch) }
}

const PersonWidget = (props) => {
  const { t, actions, locale, gettingPersonInfo, person, aktoerId, rinaUrl } = props
  const [ mounted, setMounted ] = useState(false)
  let country = null

  useEffect(() => {
    if (!mounted && aktoerId) {
      actions.getPersonInfo(aktoerId)
      setMounted(true)
    }
  }, [mounted, actions, aktoerId])

  const goToRinaClick = () => {
    if (rinaUrl) {
      window.open(rinaUrl, '_blank')
    }
  }

  if (person && person.statsborgerskap && person.statsborgerskap.land) {
    country = _.find(countries[locale], { value3: person.statsborgerskap.land.value })
  }

  return <React.Fragment>
    <div className='mb-2 text-right'>
      <Flatknapp onClick={goToRinaClick}>
        <div className='d-flex'>
          <Icons className='mr-2' color='#0067C5' kind='outlink' />
          <span>{props.t('ui:goToRina')}</span>
        </div>
      </Flatknapp>
    </div>
    <EkspanderbartpanelBase
      className='mb-5'
      ariaTittel='foo'
      heading={
        <PersonHeader
          t={t} person={person}
          aktoerId={aktoerId}
          country={country}
          gettingPersonInfo={gettingPersonInfo}
        />}>
      <PersonBody t={t} person={person} aktoerId={aktoerId} />
    </EkspanderbartpanelBase>
  </React.Fragment>
}

PersonWidget.propTypes = {
  t: PT.func.isRequired
}

const ConnectedPersonWidget = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(PersonWidget))

ConnectedPersonWidget.displayName = `Connect(${getDisplayName(withTranslation()(PersonWidget))})`

export default ConnectedPersonWidget
