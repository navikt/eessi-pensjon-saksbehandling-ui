import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { SideMenu } from 'react-sidemenu';

import '@fortawesome/fontawesome-free/css/all.css';
import 'react-sidemenu/dist/react-sidemenu.min.css';
import './sidemenu.css';

import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';
import EventForm from '../../components/p4000/EventForm';

import * as p4000Actions from '../../actions/p4000';

import * as Events from '../../components/p4000/events/';
import * as Views from '../../components/p4000/views/';

const mapStateToProps = (state) => {
    return {
        events   : state.p4000.events,
        editMode : state.p4000.editMode,
        event    : state.p4000.event,
        page     : state.p4000.page
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

const styles = {
    menu: {
        backgroundColor: 'white'
    }
}

const components = {
    file: Views.File,
    view: Views.View,
    timeline: Views.Timeline,
    work: Events.Work,
    home: Events.GenericEvent,
    child: Events.GenericEvent,
    voluntary: Events.GenericEvent,
    military: Events.GenericEvent,
    birth: Events.GenericEvent,
    learn: Events.Learn,
    daily: Events.GenericEvent,
    sick: Events.GenericEvent,
    other: Events.GenericEvent
}

class P4000 extends Component {

    state = {
        isLoaded: false
    };

    componentDidMount() {

        this.setState({
            isLoaded : true,
            page     : this.props.page
        })
    }

    handleMenuItemClick(newPage, extras) {

        const { actions, page } = this.props;

        actions.setPage(newPage);

        this.setState({
            page: newPage
        });
    }

    getItems() {

        const { t } = this.props;

        return [
            {label: t('p4000:views'),     value: '_view',     divider: true},
            {label: t('p4000:file'),      value: 'file',      icon: 'fa-file'},
            {label: t('p4000:view'),      value: 'view',      icon: 'fa-eye'},
            {label: t('p4000:timeline'),  value: 'timeline',  icon: 'fa-calendar-check'},
            {label: t('p4000:events'),    value: '_event',    divider: true, },
            {label: t('p4000:work'),      value: 'work',      icon: 'fa-briefcase'},
            {label: t('p4000:home'),      value: 'home',      icon: 'fa-home'},
            {label: t('p4000:child'),     value: 'child',     icon: 'fa-child'},
            {label: t('p4000:voluntary'), value: 'voluntary', icon: 'fa-hands-helping'},
            {label: t('p4000:military'),  value: 'military',  icon: 'fa-fighter-jet'},
            {label: t('p4000:birth'),     value: 'birth',     icon: 'fa-money-bill-wave'},
            {label: t('p4000:learn'),     value: 'learn',     icon: 'fa-school'},
            {label: t('p4000:daily'),     value: 'daily',     icon: 'fa-hand-holding-usd'},
            {label: t('p4000:sick'),      value: 'sick',      icon: 'fa-h-square'},
            {label: t('p4000:other'),     value: 'other',     icon: 'fa-calendar'}
        ];
    }

    render() {

        const { t, editMode, event, page } = this.props;

        if (!this.state.isLoaded) {
            return null;
        }
        let alert = null;
        let activeItem  = editMode && event ? event.type : page;
        let Component = components[activeItem];

        return <TopContainer>
            <h1 className='mt-3 appTitle'>{t('p4000:createNewP4000Title')}</h1>
            <Nav.Row className='no-gutters'>
                <Nav.Column className='col-lg-3' style={styles.menu}>
                    <SideMenu activeItem={activeItem} items={this.getItems()} theme='nav'
                        shouldTriggerClickOnParents={false} onMenuItemClick={this.handleMenuItemClick.bind(this)}/>
                </Nav.Column>
                <Nav.Column>
                    <Nav.Panel className='h-100'>
                        <Nav.Row className='row-alert'>
                            <Nav.Column>{alert}</Nav.Column>
                        </Nav.Row>
                        <Nav.Row className='row-eventForm'>
                            <Nav.Column>
                                <EventForm Component={Component}/>
                            </Nav.Column>
                        </Nav.Row>
                    </Nav.Panel>
                </Nav.Column>
            </Nav.Row>
        </TopContainer>
    }
}

P4000.propTypes = {
    history      : PT.object,
    t            : PT.func,
    match        : PT.object.isRequired,
    events       : PT.array.isRequired,
    editMode     : PT.bool,
    event        : PT.object
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(P4000)
);
