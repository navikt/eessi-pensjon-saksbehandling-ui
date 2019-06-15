import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import { withTranslation } from 'react-i18next'
import PersonHeader from './PersonHeader'
import { Flatknapp, EkspanderbartpanelBase } from 'components/ui/Nav'
import Icons from 'components/ui/Icons'

import * as appActions from 'actions/app'

/*const person = {
  fullName: 'Ola Normann',
  age: '68',
  personID: '12345678901',
  country: 'Norge',
  maritalStatus: 'Smashing',
  someOtherParam0: 'someOtherValue0',
  someOtherParam1: 'someOtherValue1',
  someOtherParam2: 'someOtherValue2',
  someOtherParam3: 'someOtherValue3',
  someOtherParam4: 'someOtherValue4',
  someOtherParam5: 'someOtherValue5',
  someOtherParam6: 'someOtherValue6',
  someOtherParam7: 'someOtherValue7',
  someOtherParam8: 'someOtherValue8',
  someOtherParam9: 'someOtherValue9'
}*/

const mapStateToProps = (state) => {
  return {
    person: state.app.person,
    gettingPersonInfo: state.loading.gettingPersonInfo,
    aktoerId: state.app.params.aktoerId,
    rinaUrl: state.buc.rinaUrl,

  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(appActions, dispatch) }
}

const PersonWidget = (props) => {

  const { t, actions, gettingPersonInfo, person, aktoerId, rinaUrl } = props
  const [ mounted, setMounted ] = useState(false)

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
          gettingPersonInfo={gettingPersonInfo}
        />}>
      <div> {person ? person.toString() : null} </div>
    </EkspanderbartpanelBase>
  </React.Fragment>
}

PersonWidget.propTypes = {
  t: PT.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(PersonWidget))
