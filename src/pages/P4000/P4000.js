import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer/TopContainer';
import EventForm from '../../components/p4000/EventForm/EventForm';
import * as Menu from '../../components/p4000/menu/';
import ClientAlert from '../../components/ui/Alert/ClientAlert';
import FrontPageDrawer from '../../components/drawer/FrontPage';
import StorageModal from '../../components/ui/Modal/StorageModal';

import * as routes from '../../constants/routes';
import * as p4000Actions from '../../actions/p4000';
import * as uiActions from '../../actions/ui';

import './P4000.css';

const mapStateToProps = (state) => {
    return {
        events     : state.p4000.events,
        editMode   : state.p4000.editMode,
        event      : state.p4000.event,
        eventIndex : state.p4000.eventIndex,
        page       : state.p4000.page,
        status     : state.status
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions, uiActions), dispatch)};
};

const components = {
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
        actions.setPage('new');

        actions.addToBreadcrumbs({
            url  : routes.P4000,
            ns   : 'p4000',
            label: 'p4000:app-title'
        });
    }

    render() {

        const { t, editMode, event, page, history, location, status } = this.props;

        if (!this.state.isLoaded) {
            return null;
        }

        let activeItem  = editMode && event ? event.type : page;
        let Component   = components[activeItem];
        let isEventPage = activeItem !== 'view' && activeItem !== 'new';

        return <TopContainer className='p-p4000'
            history={history} location={location}
            sideContent={<FrontPageDrawer t={t} status={status}/>}>
            <StorageModal namespace='P4000'/>
            <Nav.Row>
                <div className='col-md-5 col-lg-4'>
                    <h1 className='appTitle'>{t('p4000:app-title')}</h1>
                </div>
                <div className='col-md-7 col-lg-8'>
                    <ClientAlert className='mt-3'/>
                </div>
            </Nav.Row>
            <EventForm type={activeItem} Component={Component} history={history} location={location}/>
            {isEventPage ? <ClientAlert/> : null}
        </TopContainer>
    }
}

P4000.propTypes = {
    history      : PT.object,
    location     : PT.object.isRequired,
    t            : PT.func,
    page         : PT.string.isRequired,
    editMode     : PT.bool,
    event        : PT.object,
    eventIndex   : PT.number,
    actions      : PT.object.isRequired,
    status       : PT.object
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(P4000)
);
