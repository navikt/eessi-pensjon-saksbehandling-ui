import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import 'url-search-params-polyfill'

import VeilederPanel from '../../components/ui/Panel/VeilederPanel'
import LanguageSelector from '../../components/ui/LanguageSelector'
import TopContainer from '../../components/ui/TopContainer/TopContainer'
import TopHeader from '../../components/ui/Header/TopHeader'
import Banner from '../../components/ui/Banner/Banner'
import * as Nav from '../../components/ui/Nav'
import DocumentStatus from '../../components/ui/DocumentStatus/DocumentStatus'
import EmptyDrawer from '../../components/drawer/Empty'

import * as constants from '../../constants/constants'
import * as routes from '../../constants/routes'
import * as statusActions from '../../actions/status'
import * as appActions from '../../actions/app'
import * as uiActions from '../../actions/ui'

import './FirstPage.css'

const mapStateToProps = (state) => {
  return {
    username: state.app.username,
    userRole: state.app.userRole,
    language: state.ui.language,
    status: state.status
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions, appActions, statusActions), dispatch) }
}

class FirstPage extends Component {

  onForwardButtonClick () {
    const { history } = this.props

    history.push(routes.INDEX)
  }

  render () {
    const { t, language, history, status, location, userRole, username} = this.props

    return <div className='p-firstPage'>
      <TopHeader/>
      <Banner/>
      <div className='content'>
        <div className='container pt-4'>
        <VeilederPanel>
            <div>Her du kan:
            <ul>
            <li>a</li>
            <li>a</li>
            <li>a</li>
            </ul>
            </div>
        </VeilederPanel>
        <Nav.Knapp className='mt-3' onClick={this.onForwardButtonClick.bind(this)}>{'next'}</Nav.Knapp>
        </div>
      </div>
    </div>
  }
}

FirstPage.propTypes = {
  language: PT.string,
  location: PT.object.isRequired,
  t: PT.func.isRequired,
  actions: PT.object.isRequired,
  gettingStatus: PT.bool,
  status: PT.object,
  history: PT.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(FirstPage)
)
