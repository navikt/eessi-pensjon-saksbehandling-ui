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
import Bank from '../../components/pinfo/Bank'
import Person from '../../components/pinfo/Person'
import StayAbroad from '../../components/pinfo/StayAbroad/StayAbroad'
import Receipt from '../../components/pinfo/Receipt/Receipt'
import Confirm from '../../components/pinfo/Confirm'

import * as stepTests from '../../components/pinfo/Validation/stepTests'
import * as globalTests from '../../components/pinfo/Validation/globalTests'
import PInfoUtil from '../../components/pinfo/Util'
import * as routes from '../../constants/routes'
import * as pinfoActions from '../../actions/pinfo'
import * as uiActions from '../../actions/ui'
import * as appActions from '../../actions/app'

import './PInfo.css'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    pinfo: state.pinfo,
    step: state.pinfo.step,
    receipt: state.pinfo.receipt,
    isSendingPinfo: state.loading.isSendingPinfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions, uiActions, appActions), dispatch) }
}

class PInfo extends React.Component {
  state = {
    doPageValidationOnForwardButton: true,
    doPageValidationOnStepIndicator: false,
    pageErrors: {}
  }

  componentDidMount () {
    window.hj('trigger', 'e207-feedback-no')
  }

  componentDidUpdate () {
    const { receipt, actions, step } = this.props
    if (receipt && step === 3) {
      actions.setStep(4)
    }
  }

  validatePage (step) {
    const { person, bank, stayAbroad } = this.props.pinfo

    switch (step) {
      case 0:
        return stepTests.personStep(person)
      case 1:
        return stepTests.bankStep(bank)
      case 2:
        return stepTests.stayAbroadStep(stayAbroad)
      case 3:
        return Object.assign({}, stepTests.personStep(person), stepTests.bankStep(bank), stepTests.stayAbroadStep(stayAbroad))
      default:
        return {}
    }
  }

  onForwardButtonClick () {
    const { actions, step } = this.props

    let errors = {}
    if (this.state.doPageValidationOnForwardButton) {
      errors = this.validatePage(step)
      this.setState({
        pageErrors: errors,
        errorTimestamp: new Date().getTime()
      })
    }

    if (_.isEmpty(errors)) {
      actions.setStep(step + 1)
    }
  }

  onStepIndicatorClick (newStep) {
    const { actions, step } = this.props

    let errors = {}
    if (this.state.doPageValidationOnStepIndicator) {
      errors = this.validatePage(step)
      return this.setState({
        pageErrors: errors,
        errorTimestamp: new Date().getTime()
      })
    }

    if (_.isEmpty(errors)) {
      actions.setStep(newStep)
    }
  }

  onBackButtonClick () {
    const { actions, step } = this.props

    this.setState({
      pageErrors: {},
      errorTimestamp: new Date().getTime()
    })
    actions.setStep(step - 1)
  }

  doCancel () {
    const { actions, history } = this.props
    actions.closeModal()
    actions.clearData()
    history.push(routes.ROOT)
  }

  closeModal () {
    const { actions } = this.props
    actions.closeModal()
  }

  onCancelButtonClick () {
    const { t, actions, pinfo } = this.props

    let isPInfoEmpty = globalTests.isPInfoEmpty(pinfo)

    if (!isPInfoEmpty) {
      actions.openModal({
        modalTitle: t('pinfo:alert-leavePInfo'),
        modalText: t('pinfo:alert-areYouSureLeavePInfo'),
        modalButtons: [{
          main: true,
          text: t('ui:yes') + ', ' + t('ui:cancel').toLowerCase(),
          onClick: this.doCancel.bind(this)
        }, {
          text: t('ui:no') + ', ' + t('ui:continue').toLowerCase(),
          onClick: this.closeModal.bind(this)
        }]
      })
    } else {
      this.doCancel()
    }
  }

  onSendButtonClick () {
    const { actions, step, pinfo } = this.props

    let errors = {}
    if (this.state.doPageValidationOnForwardButton) {
      errors = this.validatePage(step)
      this.setState({
        pageErrors: errors,
        errorTimestamp: new Date().getTime()
      })
    }
    if (_.isEmpty(errors)) {
      let payload = PInfoUtil.generatePayload(pinfo)
      actions.sendPInfo(payload)
    }
  }

  errorMessage () {
    const { pageErrors } = this.state
    let errorValues = _.values(pageErrors)
    return !_.isEmpty(errorValues) ? errorValues[0] : undefined
  }

  render () {
    const { t, history, location, step, isSendingPinfo } = this.props
    const { pageErrors, errorTimestamp } = this.state

    let errorMessage = this.errorMessage()

    return <TopContainer className='p-pInfo'
      history={history} location={location}
      header={t('pinfo:app-title')}>
      { step !== 4
        ? <Nav.Stegindikator
          className='mt-4 mb-4'
          aktivtSteg={step}
          visLabel
          onChange={this.onStepIndicatorClick.bind(this)}
          autoResponsiv
          steg={_.range(0, 5).map(index => ({
            label: t('pinfo:form-step' + index),
            ferdig: index < step,
            aktiv: index === step
          }))}
        /> : null}

      {errorMessage ? <Nav.AlertStripe className='mt-3 mb-3' type='advarsel'>{t(errorMessage)}</Nav.AlertStripe> : null}
      <div className='col-md-2' />
      <div className={classNames('fieldset animate', 'mb-4', 'col-md-8')}>
        {step === 0 ? <Person pageErrors={pageErrors} errorTimestamp={errorTimestamp} /> : null}
        {step === 1 ? <Bank pageErrors={pageErrors} errorTimestamp={errorTimestamp}/> : null}
        {step === 2 ? <StayAbroad pageErrors={pageErrors} errorTimestamp={errorTimestamp}/> : null}
        {step === 3 ? <Confirm pageErrors={pageErrors} errorTimestamp={errorTimestamp}/> : null}
        {step === 4 ? <Receipt pageErrors={pageErrors} errorTimestamp={errorTimestamp}/> : null}
        <div className='mb-4 mt-4'>
          {step < 3 ? <Nav.Hovedknapp
            id='pinfo-forward-button'
            className='forwardButton mb-2 mr-3'
            onClick={this.onForwardButtonClick.bind(this)}>
            {t('confirmAndContinue')}
          </Nav.Hovedknapp> : null}
          {step === 3 ? <Nav.Hovedknapp
            id='pinfo-send-button'
            className='sendButton mb-2 mr-3'
            disabled={isSendingPinfo}
            spinner={isSendingPinfo}
            onClick={this.onSendButtonClick.bind(this)}>
            {isSendingPinfo ? t('sending') : t('confirmAndSend')}
          </Nav.Hovedknapp> : null}
          {step > 0 ? <Nav.Knapp
            id='pinfo-back-button'
            className='backButton mb-2 mr-3'
            onClick={this.onBackButtonClick.bind(this)}>
            {t('back')}
          </Nav.Knapp> : null}
          <Nav.KnappBase
            id='pinfo-cancel-button'
            type='flat'
            className='cancelButton mb-2 mr-3'
            onClick={this.onCancelButtonClick.bind(this)}>
            {t('cancel')}
          </Nav.KnappBase>
        </div>
      </div>

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
  location: PT.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(PInfo)
)
