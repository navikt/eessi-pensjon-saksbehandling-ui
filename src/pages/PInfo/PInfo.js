import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'
import _ from 'lodash'

import 'react-datepicker/dist/react-datepicker.min.css'

import * as Nav from '../../components/ui/Nav'
import TopContainer from '../../components/ui/TopContainer/TopContainer'
import Bank from '../../components/pinfo/Bank'
import Person from '../../components/pinfo/Person'
import StayAbroad from '../../components/pinfo/StayAbroad/StayAbroad'
import Receipt from '../../components/pinfo/Receipt'
import Confirm from '../../components/pinfo/Confirm'
import WaitingPanel from '../../components/app/WaitingPanel'
import AdvarselTrekant from '../../resources/images/AdvarselTrekant'

import * as stepTests from '../../components/pinfo/Validation/stepTests'
import * as globalTests from '../../components/pinfo/Validation/globalTests'
import PInfoUtil from '../../components/pinfo/Util'
import * as routes from '../../constants/routes'

import * as constants from '../../constants/constants'
import * as storageActions from '../../actions/storage'
import * as pinfoActions from '../../actions/pinfo'
import * as uiActions from '../../actions/ui'
import * as appActions from '../../actions/app'
import * as attachmentActions from '../../actions/attachment'

import './PInfo.css'

const mapStateToProps = (state) => {
  return {
    username: state.app.username,
    locale: state.ui.locale,
    isSendingPinfo: state.loading.isSendingPinfo,
    pinfo: state.pinfo,
    step: state.pinfo.step,
    maxStep: state.pinfo.maxStep,
    stepError: state.pinfo.stepError,
    send: state.pinfo.send,
    isReady: state.pinfo.isReady,
    buttonsVisible: state.pinfo.buttonsVisible,
    pageErrors: state.pinfo.pageErrors,
    fileList: state.storage.fileList,
    file: state.storage.file,
    attachments: state.attachment
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, storageActions, pinfoActions, uiActions, appActions, attachmentActions), dispatch) }
}

class PInfo extends React.Component {
  state = {
    doPageValidationOnForwardButton: true,
    doPageValidationOnStepIndicator: true,
    fileList: undefined,
    file: undefined
  }

  componentDidMount () {
    const { actions, username } = this.props
    if (window.hj) {
      window.hj('trigger', 'e207-feedback-no')
    }
    if (username) {
      actions.getAllStateFromStorage()
    }
  }

  componentDidUpdate () {
    const { send, actions, step } = this.props
    if (send && step === 3) {
      actions.setStep(4)
    }
  }

  hasNoErrors (errors) {
    for (var key in errors) {
      if (errors[key]) {
        return false
      }
    }
    return true
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
    const { actions, step, pinfo, username } = this.props

    let errors = {}
    if (this.state.doPageValidationOnForwardButton) {
      errors = this.validatePage(step)
      actions.setPageErrors(errors)
    }

    if (this.hasNoErrors(errors)) {
      actions.postStorageFileWithNoNotification(username, constants.PINFO, constants.PINFO_FILE, JSON.stringify(pinfo))
      actions.setStep(step + 1)
      window.scrollTo(0, 0)
    }
  }

  onStepIndicatorBeforeChange (nextStep) {
    const { step, actions, maxStep, pinfo, username } = this.props

    if (nextStep === step) {
      return false
    }

    if (this.state.doPageValidationOnStepIndicator && nextStep > maxStep) {
      actions.setStepError('pinfo:alert-stepTooHigh')
      return false
    }
    actions.setMainButtonsVisibility(true)
    actions.setStep(nextStep)

    actions.postStorageFileWithNoNotification(username, constants.PINFO, constants.PINFO_FILE, JSON.stringify(pinfo))
    return true
  }

  onStepIndicatorChange (newStep) {
    const { actions, step } = this.props

    let errors = {}
    if (newStep > step && this.state.doPageValidationOnStepIndicator) {
      errors = this.validatePage(step)
      actions.setPageErrors(errors)
    }

    if (this.hasNoErrors(errors)) {
      actions.setMainButtonsVisibility(true)
      actions.setStep(newStep)
    }
  }

  onBackButtonClick () {
    const { actions, history, step } = this.props

    actions.setPageErrors({})

    if (step === 0) {
      history.push({
        pathname: routes.ROOT,
        search: window.location.search
      })
    } else {
      actions.setStep(step - 1)
    }
    window.scrollTo(0, 0)
  }

  saveStateAndLeave () {
    const { actions, pinfo, username } = this.props

    actions.closeModal()
    actions.saveStateAndLeave(pinfo, username)
  }

  deleteStateAndLeave () {
    const { actions, username } = this.props

    actions.closeModal()
    actions.deleteStateAndLeave(username)
  }

  closeModal () {
    const { actions } = this.props
    actions.closeModal()
  }

  onCancelButtonClick () {
    const { t, actions, history, pinfo } = this.props

    let isPInfoEmpty = globalTests.isPInfoEmpty(pinfo)

    if (isPInfoEmpty) {
      actions.closeModal()
      history.push(routes.ROOT)
    }

    actions.openModal({
      modalTitle: t('pinfo:alert-leavePInfo'),
      modalText: t('pinfo:alert-areYouSureLeavePInfo'),
      modalButtons: [{
        main: true,
        text: t('ui:yes') + ', ' + t('ui:saveAndLeave').toLowerCase(),
        onClick: this.saveStateAndLeave.bind(this)
      }, {
        main: true,
        text: t('ui:yes') + ', ' + t('ui:deleteAndLeave').toLowerCase(),
        onClick: this.deleteStateAndLeave.bind(this)
      }, {
        text: t('ui:no') + ', ' + t('ui:continue').toLowerCase(),
        onClick: this.closeModal.bind(this)
      }]
    })
  }

  onSendButtonClick () {
    const { actions, step, pinfo, attachments } = this.props

    let errors = {}
    if (this.state.doPageValidationOnForwardButton) {
      errors = this.validatePage(step)
      actions.setPageErrors(errors)
    }
    if (this.hasNoErrors(errors)) {
      let payload = new PInfoUtil(pinfo, attachments).generatePayload()
      actions.sendPInfo(payload)
    }
    window.scrollTo(0, 0)
  }

  errorMessage () {
    const { pageErrors } = this.props
    for (var key in pageErrors) {
      if (pageErrors[key]) {
        return pageErrors[key]
      }
    }
    return undefined
  }

  render () {
    const { t, history, location, step, maxStep, stepError, isSendingPinfo, isReady, buttonsVisible } = this.props

    let errorMessage = this.errorMessage()

    if (!isReady) {
      return <TopContainer className='p-pInfo'
        history={history} location={location}
        header={t('pinfo:app-title')}>
        <WaitingPanel className='mt-5' message={t('loading')} />
      </TopContainer>
    }

    return <TopContainer className='p-pInfo'
      history={history} location={location}
      header={<span>{t('pinfo:app-title')}</span>}>
      { step !== 4
        ? <React.Fragment>
          <Nav.Stegindikator
            className='mt-4 mb-4'
            aktivtSteg={step}
            visLabel
            onBeforeChange={this.onStepIndicatorBeforeChange.bind(this)}
            onChange={this.onStepIndicatorChange.bind(this)}
            autoResponsiv
            steg={_.range(0, 5).map(index => ({
              label: t('pinfo:form-step' + index),
              ferdig: index < step,
              aktiv: index === step
            }))}
          />
          {stepError ? <div className='w-100 text-center mb-2'>
            <AdvarselTrekant size={16} />
            <span className='ml-2'>{t(stepError, { maxStep: (maxStep + 1) })}</span>
          </div> : null}
        </React.Fragment> : null}
      <Nav.Row>
        <div className='col-md-2' />
        <div className={classNames('fieldset animate', 'mb-4', 'col-md-8')}>
          {errorMessage ? <Nav.AlertStripe className='mt-3 mb-3' type='advarsel'>{t(errorMessage)}</Nav.AlertStripe> : null}
          {step === 0 ? <Person /> : null}
          {step === 1 ? <Bank /> : null}
          {step === 2 ? <StayAbroad /> : null}
          {step === 3 ? <Confirm /> : null}
          {step === 4 ? <Receipt /> : null}
        </div>
        <div className='col-md-2' />
      </Nav.Row>
      {buttonsVisible && step < 5 ? <Nav.Row>
        <div className='col-md-12 text-center mb-4 mt-4'>
          {step < 3 ? <Nav.Hovedknapp
            id='pinfo-forward-button'
            className='forwardButton mb-2 mr-3'
            onClick={this.onForwardButtonClick.bind(this)}>
            {t('saveAndContinue')}
          </Nav.Hovedknapp> : null}
          {step === 3 ? <Nav.Hovedknapp
            id='pinfo-send-button'
            className='sendButton mb-2 mr-3'
            disabled={isSendingPinfo}
            spinner={isSendingPinfo}
            onClick={this.onSendButtonClick.bind(this)}>
            {isSendingPinfo ? t('sending') : t('confirmAndSend')}
          </Nav.Hovedknapp> : null}
          {step < 4 ? <Nav.Knapp
            id='pinfo-back-button'
            className='backButton mb-2 mr-3'
            onClick={this.onBackButtonClick.bind(this)}>
            {t('back')}
          </Nav.Knapp> : null}
          { step < 4 ? <Nav.KnappBase
            id='pinfo-cancel-button'
            type='flat'
            className='cancelButton mb-2 mr-3'
            onClick={this.onCancelButtonClick.bind(this)}>
            {t('cancel-main')}
          </Nav.KnappBase> : null}
        </div></Nav.Row> : null}
      {errorMessage ? <Nav.Row>
        <div className='col-md-2' />
        <div className='col-md-8 mb-4'>
          <Nav.AlertStripe className='mt-3 mb-3' type='advarsel'>{t(errorMessage)}</Nav.AlertStripe>
        </div>
        <div className='col-md-2' />
      </Nav.Row> : null}
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
  withTranslation()(PInfo)
)
