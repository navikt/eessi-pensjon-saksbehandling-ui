import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'

import TopContainer from '../../components/ui/TopContainer/TopContainer'
import EventForm from '../../components/p4000/EventForm/EventForm'
import * as Menu from '../../components/p4000/menu/'
import Pdf from '../../components/drawer/Pdf'
import StorageModal from '../../components/ui/Modal/StorageModal'

import * as routes from '../../constants/routes'
import * as storages from '../../constants/storages'
import * as p4000Actions from '../../actions/p4000'
import * as uiActions from '../../actions/ui'

import './P4000.css'

const mapStateToProps = (state) => {
  return {
    events: state.p4000.events,
    event: state.p4000.event,
    eventIndex: state.p4000.eventIndex,
    status: state.status
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, p4000Actions, uiActions), dispatch) }
}

const components = {
  timeline: Menu.Timeline,
  summary: Menu.Summary,
  export: Menu.Export,
  index: Menu.Index,
  work: Menu.Work,
  home: Menu.GenericEvent,
  child: Menu.Child,
  voluntary: Menu.GenericEvent,
  military: Menu.GenericEvent,
  birth: Menu.GenericEvent,
  learn: Menu.Learn,
  daily: Menu.GenericEvent,
  sick: Menu.GenericEvent,
  other: Menu.GenericEvent
}

class P4000 extends Component {
    state = {
      isLoaded: false,
      page: 'index',
      pathname: undefined
    };

    componentDidMount () {
      const { actions, match } = this.props

      this.setState({
        isLoaded: true,
        page: match.params.page || 'index',
        mode: match.params.mode
      })

      actions.addToBreadcrumbs([{
        url: routes.P4000,
        label: 'p4000:app'
      }, {
        url: routes.P4000 + '/index',
        label: 'p4000:app-title'
      }])
    }

    static getDerivedStateFromProps (newProps, oldState) {
      let newPathname = newProps.location.pathname

      if (newPathname && oldState.pathname !== newPathname) {
        return {
          page: newProps.match.params.page || 'index',
          mode: newProps.match.params.mode,
          pathname: newPathname
        }
      }
      return {}
    }

    render () {
      const { t, history, location, status } = this.props
      const { isLoaded, page, mode } = this.state

      if (!isLoaded) {
        return null
      }

      return <TopContainer className='p-p4000'
        history={history} location={location}
        sideContent={<Pdf t={t} status={status} />}>
        <StorageModal namespace={page !== 'export' ? storages.P4000 : storages.FILES} />
        <h1 className='typo-sidetittel ml-0 appTitle'>{t('p4000:app-title')}</h1>
        <EventForm type={page} mode={mode} Component={components[page]} history={history} location={location} />
      </TopContainer>
    }
}

P4000.propTypes = {
  history: PT.object,
  location: PT.object.isRequired,
  t: PT.func,
  event: PT.object,
  actions: PT.object.isRequired,
  status: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(P4000)
)
