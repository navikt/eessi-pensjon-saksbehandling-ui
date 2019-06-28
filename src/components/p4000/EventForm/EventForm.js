import React from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import { withTranslation } from 'react-i18next'
import { withRouter } from 'react-router'
import classNames from 'classnames'
import _ from 'lodash'
import * as Nav from '../../ui/Nav'
import EventList from '../EventList/EventList'

import * as routes from '../../../constants/routes'

import * as p4000Actions from '../../../actions/p4000'
import * as uiActions from '../../../actions/ui'

import './EventForm.css'
import { getDisplayName } from '../../../utils/displayName'

const mapStateToProps = (state) => {
  return {
    events: state.p4000.events,
    event: state.p4000.event,
    eventIndex: state.p4000.eventIndex
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, p4000Actions, uiActions), dispatch) }
}

class EventForm extends React.Component {
  async handleSaveRequest () {
    const { actions, history, event, type } = this.props

    let valid = await this.component.passesValidation()

    if (valid) {
      event.type = type
      actions.pushEventToP4000Form(event)
      history.push(routes.P4000)
    }
  }

  async handleSaveEditRequest () {
    const { actions, history, event, eventIndex } = this.props

    let valid = await this.component.passesValidation()

    if (valid) {
      actions.replaceEventOnP4000Form(event, eventIndex)
      history.replace(routes.P4000 + '/' + event.type)
    }
  }

  async handleEditRequest (event, eventIndex) {
    const { actions, history } = this.props

    if (this.component) {
      await this.component.resetValidation()
    }
    actions.editEvent(eventIndex)
    history.replace(routes.P4000 + '/' + event.type + '/edit')
  }

  handleDeleteRequest () {
    const { t, actions } = this.props

    actions.openModal({
      modalTitle: t('p4000:event-delete-confirm-title'),
      modalText: t('p4000:event-delete-confirm-text'),
      modalButtons: [{
        main: true,
        text: t('ui:yes') + ', ' + t('ui:delete'),
        onClick: this.deleteEvent.bind(this)
      }, {
        text: t('ui:no') + ', ' + t('ui:cancel'),
        onClick: this.closeModal.bind(this)
      }]
    })
  }

  deleteEvent () {
    const { actions, history, eventIndex } = this.props

    actions.closeModal()
    actions.deleteEventToP4000Form(eventIndex)
    history.push(routes.P4000)
  }

  closeModal () {
    const { actions } = this.props

    actions.closeModal()
  }

  async handleCancelRequest (event, eventIndex) {
    const { actions, history } = this.props

    await this.component.resetValidation()
    if (eventIndex) {
      actions.cancelEditEvent(eventIndex)
    }
    history.push(routes.P4000)
  }

  render () {
    let { t, type, mode, eventIndex, events, history, location, Component } = this.props
    let isEventPage = !((type === 'timeline' || type === 'index' || type === 'summary' || type === 'export'))
    let hideEventList = (type === 'timeline' || type === 'summary' || type === 'export' || _.isEmpty(events))
    Component.displayName = getDisplayName(Component)

    return <div className='c-p4000-eventForm'>
      <EventList className={classNames({ 'hiding': hideEventList })}
        events={events} eventIndex={eventIndex} mode={mode}
        cancelEditRequest={this.handleCancelRequest.bind(this)}
        handleEditRequest={this.handleEditRequest.bind(this)} />
      <Component history={history}
        location={location}
        type={type}
        mode={mode}
        provideController={(component) => { this.component = component }} />
      {isEventPage ? <Nav.Row className='row-buttons mb-4 mt-4'>
        <div className='col-md-12'>
          {mode !== 'edit'
            ? <React.Fragment>
              <Nav.Hovedknapp className='saveButton' onClick={this.handleSaveRequest.bind(this)}>{t('ui:save')}</Nav.Hovedknapp>
              <Nav.Knapp className='cancelButton' onClick={this.handleCancelRequest.bind(this)}>{t('ui:cancel')}</Nav.Knapp>
            </React.Fragment>
            : <React.Fragment>
              <Nav.Hovedknapp className='editButton' onClick={this.handleSaveEditRequest.bind(this)}>{t('ui:edit')}</Nav.Hovedknapp>
              <Nav.Knapp className='deleteButton' onClick={this.handleDeleteRequest.bind(this)}>{t('ui:delete')}</Nav.Knapp>
              <Nav.KnappBase type='flat' className='cancelButton' onClick={this.handleCancelRequest.bind(this)}>{t('ui:cancel')}</Nav.KnappBase>
            </React.Fragment>
          }
        </div>
      </Nav.Row> : null}
    </div>
  }
}

EventForm.propTypes = {
  t: PT.func.isRequired,
  mode: PT.string,
  type: PT.string.isRequired,
  events: PT.array.isRequired,
  event: PT.object,
  eventIndex: PT.number,
  actions: PT.object,
  Component: PT.func,
  history: PT.object.isRequired,
  location: PT.object
}

const ConnectedEventForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withRouter(
    withTranslation()(EventForm)
  )
)

ConnectedEventForm.displayName = `Connect(${getDisplayName(withTranslation()(EventForm))})`

export default ConnectedEventForm
