import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import _ from 'lodash';

import * as p4000Actions from '../../actions/p4000';
import * as Nav from '../../components/ui/Nav';
import ExistingEvents from '../../components/p4000/ExistingEvents';

import './custom-eventform.css';

import * as Steps from './steps';
import * as Views from './views';

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

const components = {
    work: Steps.Work,
    home: Steps.Home,
    child: Steps.Child,
    voluntary: Steps.Voluntary,
    military: Steps.Military,
    birth: Steps.Birth,
    learn: Steps.Learn,
    daily: Steps.Daily,
    sick: Steps.Sick,
    other: Steps.Other,
    events: Views.Events,
    timeline: Views.Timeline,
    file: Views.File
}

const styles = {
    editMode: {
        backgroundColor: '#FFF0F0',
        padding: '10px',
        margin: '15px 5px'
    }
}

class EventForm extends React.Component {

    handleSave () {

        const { actions, event } = this.props;
        actions.pushEventToP4000Form(event);
    }

    handleEdit () {

        const { actions, event, eventIndex } = this.props;
        actions.replaceEventOnP4000Form(event, eventIndex);
    }

    handleDelete () {

        const { actions, eventIndex } = this.props;
        actions.deleteEventToP4000Form(eventIndex);
    }

    handleCancel () {

        const { actions, eventIndex } = this.props;
        actions.cancelEditEvent(eventIndex);
    }

    render() {

        let { t, type, editMode, eventIndex, events } = this.props;

        let Component = components[type];

        return <div className='div-eventForm'>
            <Nav.Row className={classNames('existingEvents', 'mb-4', 'no-gutters',
                {'hiding' : (type === 'timeline' || type === 'file') || _.isEmpty(events)})}>
                <Nav.Column>
                    <ExistingEvents events={events} eventIndex={eventIndex}/>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='row-component mb-4' style={editMode ? styles.editMode : null}>
                <Nav.Column>
                    <Component/>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='row-buttons mb-4'>
                <Nav.Column>
                    {!editMode && (type !== 'timeline' && type !== 'file') ? <Nav.Hovedknapp className='forwardButton' onClick={this.handleSave.bind(this)}>{t('ui:save')}</Nav.Hovedknapp> : null}
                    {editMode ?  <Nav.Hovedknapp className='editButton'    onClick={this.handleEdit.bind(this)}>{t('ui:edit')}</Nav.Hovedknapp> : null}
                    {editMode ?  <Nav.Knapp className='deleteButton'       onClick={this.handleDelete.bind(this)}>{t('ui:delete')}</Nav.Knapp>  : null}
                    {editMode ?  <Nav.Knapp className='cancelButton'       onClick={this.handleCancel.bind(this)}>{t('ui:cancel')}</Nav.Knapp>  : null}
                </Nav.Column>
            < /Nav.Row>
        </div>
    }
}

EventForm.propTypes = {
    t          : PT.func.isRequired,
    type       : PT.string.isRequired,
    events     : PT.array.isRequired,
    editMode   : PT.bool.isRequired,
    eventIndex : PT.number,
    history    : PT.object,
    actions    : PT.object
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(
        withRouter(EventForm)
    )
);
