import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import _ from 'lodash';

import * as p4000Actions from '../../../actions/p4000';
import * as Nav from '../../ui/Nav';
import EventList from '../EventList/EventList';

import './EventForm.css';

const mapStateToProps = (state) => {
    return {
        events     : state.p4000.events,
        editMode   : state.p4000.editMode,
        event      : state.p4000.event,
        eventIndex : state.p4000.eventIndex
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

class EventForm extends React.Component {

    async handleSave () {

        const { actions, event, type } = this.props;

        let valid = await this.component.passesValidation();

        if (valid) {
            event.type = type;
            actions.pushEventToP4000Form(event);
        }
    }

    async handleEdit () {

        const { actions, event, eventIndex } = this.props;

        let valid = await this.component.passesValidation();

        if (valid) {
            actions.replaceEventOnP4000Form(event, eventIndex);
        }
    }

    async handleEditRequest(eventIndex) {

        const { actions } = this.props;

        await this.component.resetValidation();
        actions.editEvent(eventIndex);
    }

    handleDelete () {

        const { actions, eventIndex } = this.props;
        actions.deleteEventToP4000Form(eventIndex);
    }

    async handleCancelRequest () {

        const { actions, eventIndex } = this.props;

        await this.component.resetValidation();
        actions.cancelEditEvent(eventIndex);
    }

    render() {

        let { t, type, editMode, eventIndex, events, Component } = this.props;
        let isEventPage = ! ((type === 'view' || type === 'new' || type === 'file'));
        let hideEventList = (type === 'view' || type === 'file') || _.isEmpty(events);

        return <Nav.Panel className='p-0 panel-eventForm'>
            <Nav.Row className={classNames('eventList', {'hiding' : hideEventList})}>
                <Nav.Column>
                    <EventList events={events} eventIndex={eventIndex} cancelEditRequest={this.handleCancelRequest.bind(this)} handleEditRequest={this.handleEditRequest.bind(this)}/>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className={classNames('row-component', 'mb-4', {'editMode' : editMode})}>
                <Nav.Column>
                    <Component type={type} provideController={(component) => {this.component = component}}/>
                </Nav.Column>
            </Nav.Row>
            {isEventPage ? (!editMode ?
            <Nav.Row className='row-buttons mb-4 text-center'>
                <Nav.Column>
                    <Nav.Hovedknapp className='saveButton' onClick={this.handleSave.bind(this)}>{t('ui:save')}</Nav.Hovedknapp>
                </Nav.Column>
                <Nav.Column>
                    <Nav.Knapp className='cancelButton' onClick={this.handleCancelRequest.bind(this)}>{t('ui:cancel')}</Nav.Knapp>
                </Nav.Column>
            </Nav.Row> :
            <Nav.Row className='row-buttons mb-4 text-center'>
                <Nav.Column>
                    <Nav.Hovedknapp className='editButton' onClick={this.handleEdit.bind(this)}>{t('ui:edit')}</Nav.Hovedknapp>
                </Nav.Column>
                <Nav.Column>
                    <Nav.Knapp className='deleteButton' onClick={this.handleDelete.bind(this)}>{t('ui:delete')}</Nav.Knapp>
                </Nav.Column>
                <Nav.Column>
                    <Nav.Knapp className='cancelButton' onClick={this.handleCancelRequest.bind(this)}>{t('ui:cancel')}</Nav.Knapp>
                </Nav.Column>
            </Nav.Row>) : null}
        </Nav.Panel>
    }
}

EventForm.propTypes = {
    t          : PT.func.isRequired,
    type       : PT.string.isRequired,
    events     : PT.array.isRequired,
    event      : PT.object,
    editMode   : PT.bool.isRequired,
    eventIndex : PT.number,
    history    : PT.object,
    actions    : PT.object,
    Component  : PT.node
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(
        withRouter(EventForm)
    )
);
