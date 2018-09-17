import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import './P4000.css';

import Icons from '../../components/ui/Icons';
import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';
import EventForm from '../../components/p4000/EventForm/EventForm';
import * as Menu from '../../components/p4000/menu/';
import ClientAlert from '../../components/ui/Alert/ClientAlert';

import * as p4000Actions from '../../actions/p4000';
import * as uiActions from '../../actions/ui';

const mapStateToProps = (state) => {
    return {
        events     : state.p4000.events,
        editMode   : state.p4000.editMode,
        event      : state.p4000.event,
        eventIndex : state.p4000.eventIndex,
        page       : state.p4000.page
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions, uiActions), dispatch)};
};

const components = {
    file: Menu.File,
    view: Menu.View,
    'new': Menu.New,
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
        isLoaded: false
    };

    componentDidMount() {

        const { actions } = this.props;

        this.setState({
            isLoaded : true
        });
        actions.setPage('file');
    }

    onFileButtonClick() {

        const { actions, editMode, eventIndex } = this.props;
        if (editMode) {
            actions.cancelEditEvent(eventIndex);
        }
        actions.setPage('file');
    }

    render() {

        const { t, editMode, event, page, history, location } = this.props;

        if (!this.state.isLoaded) {
            return null;
        }

        let activeItem  = editMode && event ? event.type : page;
        let Component   = components[activeItem];
        let isEventPage = activeItem !== 'view' && activeItem !== 'new' && activeItem !== 'file';

        return <TopContainer className='p4000 topContainer'>
            <Nav.Row>
                <div className='col-md-5 col-lg-4'>
                    <h1 className='mt-4 ml-3 mb-3 appTitle'>
                        <Icons title={t('ui:back')} className='mr-3' style={{cursor: 'pointer'}} kind='caretLeft' onClick={() => history.push('/')}/>
                        {t('p4000:app-title')}
                    </h1>
                    <Nav.Knapp className='fileButton ml-3 mb-3' onClick={this.onFileButtonClick.bind(this)} disabled={activeItem === 'file'}>
                        <Icons className='mr-2' kind='menu' size='1x'/>
                        {t('ui:file')}
                    </Nav.Knapp>
                </div>
                <div className='col-md-7 col-lg-8'>
                    <ClientAlert className='mt-3'/>
                </div>
            </Nav.Row>
            <EventForm type={activeItem} Component={Component} history={history} location={location}/>
            {isEventPage ? <Nav.Row className='mb-4'>
                <Nav.Column>
                    <ClientAlert/>
                </Nav.Column>
            </Nav.Row> : null}
        </TopContainer>
    }
}

P4000.propTypes = {
    history      : PT.object,
    location     : PT.object,
    t            : PT.func,
    page         : PT.string.isRequired,
    editMode     : PT.bool,
    event        : PT.object,
    eventIndex   : PT.number,
    actions      : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(P4000)
);
