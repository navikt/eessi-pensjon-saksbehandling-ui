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

const mapStateToProps = (state) => {
    return {
        events     : state.p4000.events,
        editMode   : state.p4000.editMode,
        event      : state.p4000.event,
        eventIndex : state.p4000.eventIndex,
        page       : state.p4000.page,
        status     : state.p4000.status
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

class EventForm extends React.Component {

    async handleSave () {

        const { actions, event, page } = this.props;

        let valid = await this.component.passesValidation();

        if (valid) {
            event.type = page;
            actions.pushEventToP4000Form(event);
        }
    }

     async handleSaveAndBack () {

         const { actions, event, page } = this.props;

         let valid = await this.component.passesValidation();

         if (valid) {
             event.type = page;
            actions.pushEventToP4000Form(event);
         }
     }

    async handleEdit () {

        const { actions, page, event, eventIndex } = this.props;

        let valid = await this.component.passesValidation();

        if (valid) {
            event.type = page;
            actions.replaceEventOnP4000Form(event, eventIndex);
        }
    }

    handleEditRequest(eventIndex) {

        const { actions } = this.props;

        actions.editEvent(eventIndex);
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

        let { t, actions, page, editMode, eventIndex, events, status, Component } = this.props;
        let isMenuPages = (page === 'view' || page === 'timeline' || page === 'file');

        if (status) {

            setTimeout(() => {
                actions.clearStatus();
            }, 5000);
        }

        return <div className='div-eventForm'>
            <Nav.Row className={classNames('existingEvents', 'mb-4', 'no-gutters',
                {'hiding' : isMenuPages || _.isEmpty(events)})}>
                <Nav.Column>
                    <ExistingEvents events={events} eventIndex={eventIndex} handleEditRequest={this.handleEditRequest.bind(this)}/>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className={classNames('row-component', 'mb-4', {'editMode' : editMode})}>
                <Nav.Column>
                     <div style={{minHeight:'90px'}}>
                         {status ? <Nav.AlertStripe type='suksess'>{t(status)}</Nav.AlertStripe> : null}
                     </div>
                    <Component provideController={(component) => {this.component = component}}/>
                </Nav.Column>
            </Nav.Row>
            {isMenuPages ? null :
                <Nav.Row className='row-buttons mb-4'>
                    <Nav.Column>
                        <div>
                        {!editMode ? <Nav.Hovedknapp className='saveButton'
                             onClick={this.handleSave.bind(this)}>{t('ui:save')}</Nav.Hovedknapp> : null}
                        {!editMode ? <Nav.Hovedknapp className='saveAndBackButton ml-3'
                             onClick={this.handleSaveAndBack.bind(this)}>{t('ui:saveAndBack')}</Nav.Hovedknapp> : null}
                        {editMode ?  <Nav.Hovedknapp className='editButton'   onClick={this.handleEdit.bind(this)}>{t('ui:edit')}</Nav.Hovedknapp> : null}
                        {editMode ?  <Nav.Knapp className='deleteButton ml-3' onClick={this.handleDelete.bind(this)}>{t('ui:delete')}</Nav.Knapp>  : null}
                        {editMode ?  <Nav.Knapp className='cancelButton ml-3' onClick={this.handleCancel.bind(this)}>{t('ui:cancel')}</Nav.Knapp>  : null}
                        </div>
                        <div>
                            {status ? <Nav.AlertStripe className='mt-3' type='suksess'>{t(status)}</Nav.AlertStripe> : null}
                        </div>
                    </Nav.Column>
                </Nav.Row>
            }
        </div>
    }
}


EventForm.propTypes = {
    t          : PT.func.isRequired,
    page       : PT.string.isRequired,
    events     : PT.array.isRequired,
    event      : PT.object,
    status     : PT.string,
    editMode   : PT.bool.isRequired,
    eventIndex : PT.number,
    history    : PT.object,
    actions    : PT.object,
    component  : PT.node.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(
        withRouter(EventForm)
    )
);
