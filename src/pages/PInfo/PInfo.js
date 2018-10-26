import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { translate } from 'react-i18next'
import classNames from 'classnames'
import moment from 'moment'
import _ from 'lodash'

import 'react-datepicker/dist/react-datepicker.min.css'

import * as Nav from '../../components/ui/Nav'
import TopContainer from '../../components/ui/TopContainer/TopContainer'
import File from '../../components/ui/File/File'
import FrontPageDrawer from '../../components/drawer/FrontPage'

import * as UrlValidator from '../../utils/UrlValidator'
import * as routes from '../../constants/routes'
import * as pinfoActions from '../../actions/pinfo'
import * as uiActions from '../../actions/ui'
import * as appActions from '../../actions/app'
import * as storageActions from '../../actions/storage'
import * as storages from '../../constants/storages'
import Bank from '../../components/form/Bank'
import Contact from '../../components/form/Contact'
import Work from '../../components/form/Work'
import PdfUploadComponent from '../../components/form/PdfUploadComponent'
import Pension from '../../components/form/Pension'

import './PInfo.css'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    form: state.pinfo.form,
    referrer: state.app.referrer,
    status: state.status,
    username: state.app.username,
    file: state.storage.file
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions, uiActions, appActions, storageActions), dispatch) }
}

const onBackButtonClick = async (props) => (
  props.actions.setEventProperty({ step: props.form.step - 1, displayError: false })
)

const onBackToReferrerButtonClick = async (props) => (
  UrlValidator.validateReferrer(props.referrer)
    ? props.actions.deleteLastBreadcrumb() && props.history.push(routes.ROOT + props.referrer)
    : null
)

const onSaveButtonClick = (props) => {
  props.actions.postStorageFile(props.username, storages.PINFO, 'PINFO', JSON.stringify(props.form))
  props.history.push(routes.PSELV + '?referrer=pinfo')
}

const setStep = (props, index) => (
  props.actions.setEventProperty({ step: index, displayError: false })
)

/*
if 'e' is an actual event, store e.target.value under [key]
else if 'e' is an instance of moment (ie. a datetime object) store e as date format string under [key].
else store the raw value of e under [key]
*/
const setValue = (props, key, e) => {
  if (e) {
    if (!e.target) {
      if (e instanceof moment) {
        props.actions.setEventProperty({ [key]: e.toDate() })
      } else {
        props.actions.setEventProperty({ [key]: e })
      }
    } else {
      props.actions.setEventProperty({ [key]: e.target.value })
    }
  } else {
    props.actions.setEventProperty({ [key]: null })
  }
}

function isValid (e) {
  e.preventDefault()
  let validity = e.target.form.checkValidity()// reportValidity();
  return validity
}

class PInfo extends React.Component {
  constructor (props) {
    super(props)
    this.props.actions.getStorageFile(props.username, storages.PINFO, 'PINFO')
  }

  componentDidMount () {
    let props = this.props
    let referrer = new URLSearchParams(props.location.search).get('referrer')
    if (referrer) {
      props.actions.setReferrer(referrer)
    }
    props.actions.addToBreadcrumbs({
      url: routes.PINFO,
      ns: 'pinfo',
      label: 'pinfo:app-title'
    })
  }

  render () {
    let props = this.props
    return (<TopContainer className='p-pInfo'
      history={props.history} location={props.location}
      sideContent={<FrontPageDrawer t={props.t} status={props.status} />}>
      <Nav.Row className='mb-4'>
        <Nav.Column>
          <Nav.Tabs onChange={(e, i) => setStep(props, i)}
            defaultAktiv={props.form.step}
            tabs={_.range(0, 6).map(index => ({
              label: props.t('pinfo:form-step' + index)
            }))
            }
            kompakt={false}
          />
        </Nav.Column>
      </Nav.Row>
      <div className={classNames('fieldset animate', 'mb-4')}>
        {props.form.step === 0
          ? <form id='pinfo-form'>
            <Bank
              t={props.t}
              action={setValue.bind(null, props)}
            />
          </form>
          : null}
        {props.form.step === 1
          ? <form id='pinfo-form'>
            <Contact
              t={props.t}
              action={setValue.bind(null, props)}
            />
          </form>
          : null
        }
        {props.form.step === 2
          ? <form id='pinfo-form'>
            <Work
              t={props.t}
              action={setValue.bind(null, props)}
            />
          </form>
          : null
        }
        {props.form.step === 3 ? <form id='pinfo-form'><div>
          <PdfUploadComponent t={props.t} form={props.form}
            checkboxes={[
              { 'label': props.t('pinfo:form-attachmentTypes-01'), 'value': '01', 'id': '01', 'inputProps': { 'defaultChecked': (props.form.attachmentTypes ? props.form.attachmentTypes['01'] : false) } },
              { 'label': props.t('pinfo:form-attachmentTypes-02'), 'value': '02', 'id': '02', 'inputProps': { 'defaultChecked': (props.form.attachmentTypes ? props.form.attachmentTypes['02'] : false) } },
              { 'label': props.t('pinfo:form-attachmentTypes-03'), 'value': '03', 'id': '03', 'inputProps': { 'defaultChecked': (props.form.attachmentTypes ? props.form.attachmentTypes['03'] : false) } },
              { 'label': props.t('pinfo:form-attachmentTypes-04'), 'value': '04', 'id': '04', 'inputProps': { 'defaultChecked': (props.form.attachmentTypes ? props.form.attachmentTypes['04'] : false) } }
            ]}
            files={props.form.attachments || []}
            checkboxAction={setValue.bind(null, props, 'attachmentTypes')}
            fileUploadAction={setValue.bind(null, props, 'attachments')}
          />
        </div></form> : null}
        {props.form.step === 4 ? <form id='pinfo-form'><div className='mb-3'>
          <Pension
            t={props.t}
            pension={{
              retirementCountry: props.form.retirementCountry
            }}
            action={setValue.bind(null, props)}
            locale={props.locale}
          />
        </div> </form> : null}

        {props.form.step === 5 ? <form id='pinfo-form'><div>
          <fieldset>
            <legend>{props.t('pinfo:form-bank')}</legend>
            <dl className='row'>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-bankName')}</label></dt>
              <dd className='col-sm-8'>{props.form.bankName}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-bankAddress')}</label></dt>
              <dd className='col-sm-8'><pre>{props.form.bankAddress}</pre></dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-bankCountry')}</label></dt>
              <dd className='col-sm-8'>
                <img src={'../../../../../flags/' + _.get(props, 'form.bankCountry.value', '') + '.png'}
                  style={{ width: 30, height: 20 }}
                  alt={_.get(props, 'form.bankCountry.label', '')} />&nbsp; {_.get(props, 'form.bankCountry.label', '')}
              </dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-bankBicSwift')}</label></dt>
              <dd className='col-sm-8'>{props.form.bankBicSwift}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-bankIban')}</label></dt>
              <dd className='col-sm-8'>{props.form.bankIban}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-bankCode')}</label></dt>
              <dd className='col-sm-8'>{props.form.bankCode}</dd>
            </dl>
          </fieldset>
          <fieldset>
            <legend>{props.t('pinfo:form-user')}</legend>
            <dl className='row'>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-userEmail')}</label></dt>
              <dd className='col-sm-8'>{props.form.userEmail}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-userPhone')}</label></dt>
              <dd className='col-sm-8'>{props.form.userPhone}</dd>
            </dl>
          </fieldset>
          <fieldset>
            <legend>{props.t('pinfo:form-work')}</legend>
            <dl className='row'>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workType')}</label></dt>
              <dd className='col-sm-8'>{props.form.workType ? props.t('pinfo:form-workType-option-' + props.form.workType) : null}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workStartDate')}</label></dt>
              <dd className='col-sm-8'>{props.form.workStartDate ? moment(props.form.workStartDate).format('DD MM YYYY') : null/* P4000Util.writeDate(props.form.workStartDate) */}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workEndDate')}</label></dt>
              <dd className='col-sm-8'>{props.form.workEndDate ? moment(props.form.workEndDate).format('DD MM YYYY') : null/* P4000Util.writeDate(props.form.workEndDate) */}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workEstimatedRetirementDate')}</label></dt>
              <dd className='col-sm-8'>{props.form.workEstimatedRetirementDate ? moment(props.form.workEstimatedRetirementDate).format('DD MM YYYY') : null/* P4000Util.writeDate(props.form.workEstimatedRetirementDate) */}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workHourPerWeek')}</label></dt>
              <dd className='col-sm-8'>{props.form.workHourPerWeek}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workIncome')}</label></dt>
              <dd className='col-sm-8'>{props.form.workIncome}{' '}{_.get(props, 'form.workIncomeCurrency.currency', '')}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workPaymentDate')}</label></dt>
              <dd className='col-sm-8'>{props.form.workPaymentDate ? moment(props.form.workPaymentDate).format('DD MM YYYY') : null/* P4000Util.writeDate(props.form.workPaymentDate) */}</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-workPaymentFrequency')}</label></dt>
              <dd className='col-sm-8'>{props.form.workPaymentFrequency ? props.t('pinfo:form-workPaymentFrequency-option-' + props.form.workPaymentFrequency) : null}</dd>
            </dl>
          </fieldset>
          <fieldset>
            <legend>{props.t('pinfo:form-attachments')}</legend>
            <dl className='row'>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-attachmentTypes')}</label></dt>
              <dd className='col-sm-8'>{
                Object.entries(props.form.attachmentTypes ? props.form.attachmentTypes : {})
                  .filter(KV => KV[1])
                  .map(type => { return props.t('pinfo:form-attachmentTypes-' + type[0]) }).join(', ')
              }</dd>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-attachments')}</label></dt>
              <dd className='col-sm-8'>{
                props.form.attachments ? props.form.attachments.map((file, i) => {
                  return <File className='mr-2' key={i} file={file} deleteLink={false} downloadLink={false} />
                }) : null }
              </dd>
            </dl>
          </fieldset>
          <fieldset>
            <legend>{props.t('pinfo:form-retirement')}</legend>
            <dl className='row'>
              <dt className='col-sm-4'><label>{props.t('pinfo:form-retirementCountry')}</label></dt>
              <dd className='col-sm-8'><img src={'../../../../../flags/' + _.get(props, 'form.retirementCountry.value', '') + '.png'}
                style={{ width: 30, height: 20 }}
                alt={_.get(props, 'form.retirementCountry.label', '')} />&nbsp; {_.get(props, 'form.retirementCountry.label', '')}
              </dd>
            </dl>
          </fieldset>
        </div> </form> : null}
      </div>

      <Nav.Row className='mb-4 p-2'>
        <Nav.Column>
          {props.form.step !== 0 ? <Nav.Knapp className='backButton mr-4 w-100' type='standard' onClick={onBackButtonClick.bind(null, props)}>{props.t('ui:back')}</Nav.Knapp>
            : props.referrer ? <Nav.Knapp className='backButton mr-4 w-100' type='standard' onClick={onBackToReferrerButtonClick.bind(this, props)}>{props.t('ui:backTo') + ' ' + props.t('ui:' + props.referrer)}</Nav.Knapp>
              : null }
        </Nav.Column>
        <Nav.Column>
          {props.form.step !== 5
            ? <Nav.Hovedknapp className='forwardButton w-100' onClick={e => (isValid(e) ? props.actions.setEventProperty({ step: props.form.step + 1 }) : null)} form='pinfo-form'>{props.t('ui:forward')}</Nav.Hovedknapp>
            : <Nav.Hovedknapp className='sendButton w-100' onClick={onSaveButtonClick.bind(null, props)}>{props.t('ui:save')}</Nav.Hovedknapp> }
        </Nav.Column>
      </Nav.Row>

    </TopContainer>

    )
  }
}

PInfo.propTypes = {
  history: PT.object,
  t: PT.func,
  locale: PT.string,
  form: PT.object,
  referrer: PT.string,
  actions: PT.object,
  location: PT.object.isRequired,
  status: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(
    (PInfo)
  )
)
