import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'
import moment from 'moment'
import _ from 'lodash'

import 'react-datepicker/dist/react-datepicker.min.css'

import * as Nav from '../../components/ui/Nav'
import TopContainer from '../../components/ui/TopContainer/TopContainer'
import FrontPageDrawer from '../../components/drawer/FrontPage'

import * as routes from '../../constants/routes'
import * as pinfoActions from '../../actions/pinfo'
import * as uiActions from '../../actions/ui'
import * as appActions from '../../actions/app'
import * as storageActions from '../../actions/storage'
import * as storages from '../../constants/storages'
import Bank from '../../components/form/Bank'
import Contact from '../../components/form/Contact/Contact'
import Work from '../../components/form/Work'
import PdfUploadComponent from '../../components/form/PdfUploadComponent'
import Pension from '../../components/form/Pension'
import Summary from '../../components/form/Summary'

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

const onSaveButtonClick = (props) => {
  props.actions.postStorageFile(props.username, storages.PINFO, 'PINFO', JSON.stringify({ form: props.form }))
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
      <Nav.Row className='mb-0'>
        <Nav.Column>
          <Nav.Tabs onChange={(e, i) => setStep(props, i)} className='mt-0 ml-3 mr-3 mb-0'
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
            <Bank />
          </form>
          : null}
        {props.form.step === 1
          ? <form id='pinfo-form'>
            <Contact />
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

        {props.form.step === 5
          ? <Summary t={props.t} onSave={onSaveButtonClick.bind(null, props)} />
          : null}
      </div>

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
  withNamespaces()(PInfo)
)
