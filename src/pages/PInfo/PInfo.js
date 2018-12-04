import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'
import _ from 'lodash'

import 'react-datepicker/dist/react-datepicker.min.css'

import * as Nav from '../../components/ui/Nav'
import TopContainer from '../../components/ui/TopContainer/TopContainer'
import FrontPageDrawer from '../../components/drawer/FrontPage'
import Bank from '../../components/pinfo/Bank'
import Contact from '../../components/pinfo/Contact/Contact'
import Work from '../../components/pinfo/Work'
import Attachments from '../../components/pinfo/Attachments'
import Pension from '../../components/pinfo/Pension/Pension'
import Summary from '../../components/pinfo/Summary'
import Intro from '../../components/pinfo/Intro'

import * as stepTests from '../../components/pinfo/Validation/stepTests'
import * as routes from '../../constants/routes'
import * as pinfoActions from '../../actions/pinfo'
import * as uiActions from '../../actions/ui'
import * as appActions from '../../actions/app'
import * as storageActions from '../../actions/storage'
import * as storages from '../../constants/storages'

import './PInfo.css'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    pinfo: state.pinfo,
    step: state.pinfo.step,
    referrer: state.app.referrer,
    status: state.status,
    username: state.app.username,
    file: state.storage.file
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions, uiActions, appActions, storageActions), dispatch) }
}

class PInfo extends React.Component {
  state = {
    erorr: undefined
  }

  constructor (props) {
    super(props)
    this.props.actions.getStorageFile(props.username, storages.PINFO, 'PINFO')
  }

  componentDidMount () {
    const { location, actions } = this.props
    let referrer = new URLSearchParams(location.search).get('referrer')
    if (referrer) {
      actions.setReferrer(referrer)
    }
    actions.addToBreadcrumbs({
      url: routes.PINFO,
      ns: 'pinfo',
      label: 'pinfo:app-title'
    })
  }

  validatePage (step) {
    const { pinfo } = this.props

    switch (step) {
      case 0:
        return undefined
      case 1:
        return stepTests.contactStep(pinfo.contact)
      case 2:
        return stepTests.bankStep(pinfo.bank)
      case 3:
        return stepTests.workStep(pinfo.work)

      default:
        return ''
    }
  }

  onForwardButtonClick () {
    const { actions, step } = this.props

    let validatePageError = this.validatePage(step)
    if (validatePageError) {
      return this.setState({
        error: validatePageError
      })
    }

    actions.setEventProperty({ step: step + 1 })
    this.setState({
      error: undefined
    })
  }

  onBackButtonClick () {
    const { actions, step } = this.props

    actions.setEventProperty({ step: step - 1 })
    this.setState({
      error: undefined
    })
  }

  onSaveButtonClick () {
    const { actions, history, username, pinfo } = this.props

    actions.postStorageFile(username, storages.PINFO, 'PINFO', JSON.stringify(pinfo))
    history.push(routes.PSELV + '?referrer=pinfo')
  }

  render () {
    const { t, history, location, status, step, actions } = this.props
    const { error } = this.state

    return <TopContainer className='p-pInfo'
      history={history} location={location}
      sideContent={<FrontPageDrawer t={t} status={status} />}>
      <h1 className='typo-sidetittel mt-4'>{t('pinfo:app-title')}</h1>
      <Nav.Stegindikator
        className='mt-4 mb-4'
        aktivtSteg={step}
        visLabel
        onChange={(e) => actions.setEventProperty({ step: e })}
        autoResponsiv
        steg={_.range(0, 8).map(index => ({
          label: t('pinfo:form-step' + index),
          ferdig: index < step,
          aktiv: index === step
        }))}
      />

      {error ? <Nav.AlertStripe className='mt-3 mb-3' type='advarsel'>{t(error)}</Nav.AlertStripe> : null}

      <div className={classNames('fieldset animate', 'mb-4')}>
        {step === 0 ? <Intro /> : null}
        {step === 1 ? <Contact /> : null}
        {step === 2 ? <Bank /> : null}
        {step === 3 ? <Work /> : null}
        {step === 4 ? <Pension /> : null}
        {step === 5 ? <Attachments /> : null}
        {step === 6 ? <Summary t={t} onSave={this.onSaveButtonClick.bind(this)} /> : null}
      </div>

      {step < 8 ? <Nav.Hovedknapp
        className='forwardButton'
        onClick={this.onForwardButtonClick.bind(this)}>
        {t('confirmAndContinue')}
      </Nav.Hovedknapp> : null}
      {step > 0 ? <Nav.Knapp
        className='ml-3 backButton'
        onClick={this.onBackButtonClick.bind(this)}>
        {t('back')}
      </Nav.Knapp> : null}
    </TopContainer>
  }
}

PInfo.propTypes = {
  history: PT.object,
  t: PT.func,
  locale: PT.string,
  pinfo: PT.object,
  step: PT.number,
  referrer: PT.string,
  actions: PT.object,
  location: PT.object.isRequired,
  status: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(PInfo)
)
