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
import ClientAlert from '../../ui/Alert/ClientAlert';
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

    async handleSaveAndBack () {

        const { actions, event, type } = this.props;

        let valid = await this.component.passesValidation();

        if (valid) {
            event.type = type;
            actions.pushEventToP4000FormAndToBackToForm(event);
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
        let isMenuPages = (type === 'view' || type === 'timeline' || type === 'file');

        return <Nav.Panel className='panel-eventForm' style={{padding: 0, paddingBottom: '2rem'}}>
            <Nav.Row className='row-floating-alert floatingAlertOnTop mt-3'>
                <Nav.Column>
                    <ClientAlert/>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className={classNames('eventList', {'hiding' : isMenuPages || _.isEmpty(events)})}>
                <Nav.Column>
                    <EventList events={events} eventIndex={eventIndex} cancelEditRequest={this.handleCancelRequest.bind(this)} handleEditRequest={this.handleEditRequest.bind(this)}/>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className={classNames('row-component', 'mb-4', {'editMode' : editMode})}>
                <Nav.Column>
                    <Component type={type} provideController={(component) => {this.component = component}}/>
                </Nav.Column>
            </Nav.Row>
            {isMenuPages ? null :
                <Nav.Row className='row-buttons mb-4 text-center'>
                    {!editMode ? <Nav.Column>
                        <Nav.Hovedknapp className='saveButton'
                            onClick={this.handleSave.bind(this)}>{t('ui:save')}</Nav.Hovedknapp>
                    </Nav.Column> : null}
                    {!editMode ? <Nav.Column>
                        <Nav.Knapp className='saveAndBackButton'
                            onClick={this.handleSaveAndBack.bind(this)}>{t('ui:saveAndBack')}</Nav.Knapp>
                    </Nav.Column> : null}
                    {editMode ? <Nav.Column>
                        <Nav.Hovedknapp className='editButton'   onClick={this.handleEdit.bind(this)}>{t('ui:edit')}</Nav.Hovedknapp>
                    </Nav.Column> : null}
                    {editMode ? <Nav.Column>
                        <Nav.Knapp className='deleteButton' onClick={this.handleDelete.bind(this)}>{t('ui:delete')}</Nav.Knapp>
                    </Nav.Column> : null}
                    {editMode ? <Nav.Column>
                        <Nav.Knapp className='cancelButton' onClick={this.handleCancelRequest.bind(this)}>{t('ui:cancel')}</Nav.Knapp>
                    </Nav.Column> : null}
                </Nav.Row>}
            <Nav.Row>
                <Nav.Column>
                    <ClientAlert/>
                </Nav.Column>
            </Nav.Row>
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
