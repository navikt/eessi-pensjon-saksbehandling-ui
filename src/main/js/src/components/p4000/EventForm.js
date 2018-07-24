import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';

import * as p4000Actions from '../../actions/p4000';
import * as Nav from '../../components/ui/Nav';
import ExistingEvents from '../../components/p4000/ExistingEvents';

import * as Steps from './steps';
import * as Views from './views';

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
    timeline: Views.Timeline,
    file: Views.File
}

const styles = {
    editMode: {
        backgroundColor: '#FFF8F8',
        border: '1px solid red',
        borderRadius: '10px',
        padding: '10px',
        margin: '10px 0px 10px 0px'
    }
}

class EventForm extends React.Component {

    prepareEvent(refState) {

        let event = refState.event;
        event.startDate = refState.startDate;
        event.endDate = refState.endDate;
        event.type = refState.type;
        return event;
    }

    handleSave () {

        const { history, actions } = this.props;
        let event = this.prepareEvent(this.formRef.state);
        actions.pushEventToP4000Form(event);
    }

    handleEdit () {

        const { history, actions, eventIndex } = this.props;
        let event = this.prepareEvent(this.formRef.state);
        actions.editEventToP4000Form(event, eventIndex);
        history.push('/react/p4000/new');
    }

    handleDelete () {

        const { history, actions, eventIndex } = this.props;
        actions.deleteEventToP4000Form(eventIndex);
        history.push('/react/p4000/new');
    }

    handleCancel () {

        const { history } = this.props;
        history.push('/react/p4000/new');
    }

    render() {

        let { t, type, editMode, eventIndex, event, events } = this.props;

        let Component = components[type];

        return <div style={editMode ? styles.editMode : null}>
            {(() => {
                if (type !== 'timeline' && type !== 'file') {
                    return <Nav.Row>
                        <Nav.Column>
                            <ExistingEvents events={events} eventIndex={eventIndex}/>
                        </Nav.Column>
                    </Nav.Row>
                }
            })()}
            <Component t={t} event={event} ref={(ref) => {this.formRef = ref}}/>
            <Nav.Row className='mt-4'>
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
    editMode   : PT.bool.isRequired,
    event      : PT.object,
    eventIndex : PT.number,
    history    : PT.object,
    actions    : PT.object
};

export default connect(
    null,
    mapDispatchToProps
)(
    translate()(
        withRouter(EventForm)
    )
);
