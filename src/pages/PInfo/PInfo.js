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
import Pension from '../../components/pinfo/Pension'
import Summary from '../../components/pinfo/Summary'

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

class PInfo extends React.Component {
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

  render () {
    let props = this.props
    return (<TopContainer className='p-pInfo'
      history={props.history} location={props.location}
      sideContent={<FrontPageDrawer t={props.t} status={props.status} />}>
      <Nav.Row className='mb-0'>
        <Nav.Column>
          <Nav.Stegindikator
            aktivtSteg={props.form.step}
            visLabel
            onChange={(e) => props.actions.setEventProperty({ step: e })}
            autoResponsiv
            steg={_.range(0, 7).map(index => ({
              label: props.t('pinfo:form-step' + index),
              ferdig: index < props.form.step,
              aktiv: index === props.form.step
            }))
            }

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
            <Work />
          </form>
          : null
        }
        {props.form.step === 3 ? <form id='pinfo-form'><div>
          <Attachments />
        </div></form> : null}
        {props.form.step === 4 ? <form id='pinfo-form'><div className='mb-3'>
          <Pension />
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
