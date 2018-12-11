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
import * as storageActions from '../../actions/storage'
import * as storages from '../../constants/storages'

import './PInfo.css'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    pinfo: state.pinfo,
    status: state.status,
    username: state.app.username,
    fileList: state.storage.fileList,
    isSendingPinfo: state.loading.isSendingPinfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions, uiActions, appActions, storageActions), dispatch) }
}

class PInfoSaksbehandler extends React.Component {


  componentDidMount() {
    let { actions, username } = this.props
    actions.listStorageFiles(username, 'varsler')
  }

  onForwardButtonClick () {
    const { history } = this.props
    history.push(routes.PINFO)
  }

  onInviteButtonClick () {

  }

  render () {
    const { t, history, location, status, fileList } = this.props

    return <TopContainer className='p-pInfo'
      history={history} location={location}
      sideContent={<FrontPageDrawer t={t} status={status} />}
      header={t('pinfo:app-title')}>

      <div className={classNames('fieldset animate', 'mb-4')}>
        button to invite user
      </div>

      <div className={classNames('fieldset animate', 'mb-4')}>
        Notifications:
        {fileList ? <ul>
          {fileList.map(file => {
            return <li>{file}</li>
          })}
        </ul> : null}
      </div>
      <Nav.Hovedknapp
          id='pinfo-forward-button'
          className='forwardButton mb-2 mr-3'
          onClick={this.onInviteButtonClick.bind(this)}>
          {t('Invite')}
      </Nav.Hovedknapp>

       <Nav.Hovedknapp
        id='pinfo-forward-button'
        className='forwardButton mb-2 mr-3'
        onClick={this.onForwardButtonClick.bind(this)}>
        {t('PInfo')}
      </Nav.Hovedknapp>
    </TopContainer>
  }
}

PInfoSaksbehandler.propTypes = {
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
  withNamespaces()(PInfoSaksbehandler)
)
