import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import { withTranslation } from 'react-i18next'
import PersonHeader from './PersonHeader'
import PersonBody from './PersonBody'
import { Flatknapp, EkspanderbartpanelBase } from 'components/ui/Nav'
import Icons from 'components/ui/Icons'

import * as appActions from 'actions/app'

const mapStateToProps = (state) => {
  return {
    person: state.app.person,
    gettingPersonInfo: state.loading.gettingPersonInfo,
    aktoerId: state.app.params.aktoerId,
    rinaUrl: state.buc.rinaUrl
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
      <PersonBody t={t} person={person} aktoerId={aktoerId} />
    </EkspanderbartpanelBase>
  </React.Fragment>
}

PersonWidget.propTypes = {
  t: PT.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(PersonWidget))
