import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'
import _ from 'lodash'

import 'react-datepicker/dist/react-datepicker.min.css'

import * as Nav from '../../components/ui/Nav'
import Icons from '../../components/ui/Icons'
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
import * as attachmentActions from '../../actions/attachment'
import * as appActions from '../../actions/app'

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
  return { actions: bindActionCreators(Object.assign({}, storageActions, pinfoActions, appActions, uiActions, attachmentActions), dispatch) }
}

const PInfo = (props) => {

  const doPageValidationOnForwardButton = true
  const doPageValidationOnStepIndicator = true
  const [ mounted, setMounted] = useState(false)

  const { t, pageErrors, actions, history, username, location, send, step, pinfo } = props
  const { maxStep, stepError, match, isSendingPinfo, isReady, buttonsVisible, attachments } = props
  const { person, bank, stayAbroad } = props.pinfo

  if (window.hj) {
    window.hj('trigger', 'e207-feedback-no')
  }
  useEffect(() => {
    if (username && !mounted) {
      actions.getAndPrefillPersonName()
      actions.getAllStateFromStorage()
      setMounted(true)
    }
  }, [username])

  useEffect(() => {
     if (send && step === 3) {
       actions.setStep(4)
     }
  }, [send, step, actions])

  useEffect(() => {
    if (_.has(match, 'params.step') && String(step + 1) !== match.params.step) {
      history.push({
        pathname: `${routes.PINFO}/${step + 1}`,
        search: window.location.search
      })
      if (window.hj) {
        window.hj('vpv', `/_/pinfo/${step + 1}`)
      }
    }
  }, [step])

  const hasNoErrors = (errors) => {
    for (var key in errors) {
      if (errors[key]) {
        return false
      }
    }
    return true
  }

  const validatePage = (step) => {

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

  const onForwardButtonClick = () => {

    let errors = {}
    if (doPageValidationOnForwardButton) {
      errors = validatePage(step)
      actions.setPageErrors(errors)
    }

    if (hasNoErrors(errors)) {
      actions.setStep(step + 1)
      actions.postStorageFileWithNoNotification(username, constants.PINFO, constants.PINFO_FILE, JSON.stringify(pinfo))
      window.scrollTo(0, 0)
    }
  }

  const onStepIndicatorBeforeChange = (nextStep) => {

    if (nextStep === step) {
      return false
    }

    if (doPageValidationOnStepIndicator && nextStep > maxStep) {
      actions.setStepError('pinfo:alert-stepTooHigh')
      return false
    }
    actions.setMainButtonsVisibility(true)
    actions.setStep(nextStep)

    actions.postStorageFileWithNoNotification(username, constants.PINFO, constants.PINFO_FILE, JSON.stringify(pinfo))
    return true
  }

  const onStepIndicatorChange = (newStep) => {

    let errors = {}
    if (newStep > step && doPageValidationOnStepIndicator) {
      errors = validatePage(step)
      actions.setPageErrors(errors)
    }

    if (hasNoErrors(errors)) {
      actions.setMainButtonsVisibility(true)
      actions.setStep(newStep)
    }
  }

  const onBackButtonClick = () => {
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

  const saveStateAndExit = () => {
    actions.closeModal()
    actions.saveStateAndExit(pinfo, username)
  }

  const deleteStateAndExit = () => {
    actions.closeModal()
    actions.deleteStateAndExit(username)
  }

  const closeModal = () => {
    actions.closeModal()
  }

  const onSaveAndExitButtonClick = () => {

    let isPInfoEmpty = globalTests.isPInfoEmpty(pinfo)

    if (isPInfoEmpty) {
      actions.closeModal()
      history.push(routes.ROOT)
    }

    actions.openModal({
      modalTitle: t('pinfo:alert-saveAndExitPInfo'),
      modalText: t('pinfo:alert-areYouSureSaveAndExitPInfo'),
      modalButtons: [{
        main: true,
        text: t('ui:yes') + ', ' + t('ui:exit').toLowerCase(),
        onClick: saveStateAndExit
      }, {
        text: t('ui:no') + ', ' + t('ui:continue').toLowerCase(),
        onClick: closeModal
      }]
    })
  }

  const onDeleteAndExitLinkClick = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    let isPInfoEmpty = globalTests.isPInfoEmpty(pinfo)

    if (isPInfoEmpty) {
      actions.closeModal()
      history.push(routes.ROOT)
    }

    actions.openModal({
      modalTitle: t('pinfo:alert-deleteAndExitPInfo'),
      modalContent: <div className='m-4 text-center' dangerouslySetInnerHTML={{ __html: t('pinfo:alert-areYouSureDeleteAndExitPInfo') }} />,
      modalButtons: [{
        main: true,
        text: t('ui:yes') + ', ' + t('ui:delete').toLowerCase(),
        onClick: deleteStateAndExit
      }, {
        text: t('ui:no'),
        onClick: closeModal
      }]
    })
  }

  const onSendButtonClick = () => {

    let errors = {}
    if (doPageValidationOnForwardButton) {
      errors = validatePage(step)
      actions.setPageErrors(errors)
    }
    if (hasNoErrors(errors)) {
      let payload = new PInfoUtil(pinfo, attachments).generatePayload()
      actions.sendPInfo(payload)
    }
    window.scrollTo(0, 0)
  }

  const errorMessage = () => {
    for (var key in pageErrors) {
      if (pageErrors[key]) {
        return pageErrors[key]
      }
    }
    return undefined
  }

  if (!isReady) {
    return <TopContainer className='p-pInfo'
      history={history} location={location}
      header={t('pinfo:app-title')}>
      <WaitingPanel className='mt-5' message={t('loading')} />
    </TopContainer>
  }

  const _errorMessage = errorMessage()
  const isPInfoEmpty = globalTests.isPInfoEmpty(pinfo)
  const noPeriods = step === 2 && _.isEmpty(pinfo.stayAbroad)

  return <TopContainer className='p-pInfo'
    history={history} location={location}
    header={<span>{t('pinfo:app-title')}</span>}>
    { step !== 4
      ? <React.Fragment>
        {!isPInfoEmpty ? <Nav.Row>
          <div className='col-sm-12 mb-4 delete-form-div'>
            <Nav.Lenke
              className='delete-form-link mt-3'
              id='pinfo-deleteAndExit-button'
              href='#reset'
              onClick={onDeleteAndExitLinkClick}>
              <Icons kind='trashcan' className='mr-2' size={16} />
              <span>{t('pinfo:form-deleteAndExit')}</span>
            </Nav.Lenke>
          </div>
        </Nav.Row> : null}
        <Nav.Stegindikator
          className='mt-4 mb-4'
          aktivtSteg={step}
          visLabel
          onBeforeChange={onStepIndicatorBeforeChange}
          onChange={onStepIndicatorChange}
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
      <div className='col-sm-2' />
      <div className={classNames('fieldset animate', 'ml-auto', 'mr-auto', 'col-sm-8')}>
        {_errorMessage ? <Nav.AlertStripe className='mt-3 mb-3' type='advarsel'>{t(_errorMessage)}</Nav.AlertStripe> : null}
        {step === 0 ? <Person /> : null}
        {step === 1 ? <Bank /> : null}
        {step === 2 ? <StayAbroad /> : null}
        {step === 3 ? <Confirm /> : null}
        {step === 4 ? <Receipt /> : null}
      </div>
      <div className='col-sm-2' />
    </Nav.Row>
    {buttonsVisible && step < 5 ? <Nav.Row>
      <div className='col-sm-12 text-center mb-4 mt-4'>
        {step < 3 ? <Nav.Hovedknapp
          id='pinfo-forward-button'
          disabled={noPeriods}
          className='forwardButton mb-2 mr-3 w-sm-100'
          onClick={onForwardButtonClick}>
          {t('saveAndContinue')}
        </Nav.Hovedknapp> : null}
        {step === 3 ? <Nav.Hovedknapp
          id='pinfo-send-button'
          className='sendButton mb-2 mr-3 w-sm-100'
          disabled={isSendingPinfo}
          spinner={isSendingPinfo}
          onClick={onSendButtonClick}>
          {isSendingPinfo ? t('sending') : t('confirmAndSend')}
        </Nav.Hovedknapp> : null}
        {step < 4 ? <Nav.Knapp
          id='pinfo-back-button'
          className='backButton mb-2 mr-3 w-sm-100'
          onClick={onBackButtonClick}>
          {t('back')}
        </Nav.Knapp> : null}
        { step < 4 ? <Nav.KnappBase
          id='pinfo-saveandexit-button'
          type='flat'
          className='cancelButton mb-2 mr-3 w-sm-100'
          onClick={onSaveAndExitButtonClick}>
          {t('pinfo:form-saveAndExit')}
        </Nav.KnappBase> : null}
      </div></Nav.Row> : null}
    {_errorMessage ? <Nav.Row>
      <div className='col-sm-2' />
      <div className='col-sm-8 mb-4'>
        <Nav.AlertStripe className='mt-3 mb-3' type='advarsel'>{t(_errorMessage)}</Nav.AlertStripe>
      </div>
      <div className='col-sm-2' />
    </Nav.Row> : null}
  </TopContainer>
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
