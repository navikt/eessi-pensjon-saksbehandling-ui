import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { SideMenu } from 'react-sidemenu';

import '@fortawesome/fontawesome-free/css/all.css';
import 'react-sidemenu/dist/react-sidemenu.min.css';
import './P4000.css';

import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';
import EventForm from '../../components/p4000/EventForm/EventForm';
import * as Menu from '../../components/p4000/menu/';

import * as p4000Actions from '../../actions/p4000';

const mapStateToProps = (state) => {
    return {
        events   : state.p4000.events,
        editMode : state.p4000.editMode,
        event    : state.p4000.event,
        page     : state.p4000.page,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

const components = {
    file: Menu.File,
    view: Menu.View,
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

        this.setState({
            isLoaded : true,
            page     : this.props.page
        })
    }

    handleMenuItemClick(newPage, extras) {

        const { actions, page, editMode } = this.props;

        if (editMode) {
            this.setState({
                page: page
            });
            return;
        }

        actions.setPage(newPage);

        this.setState({
            page: newPage
        });
    }

    getItems() {

        const { t, event } = this.props;

        if (event === undefined) {
             return [
                 {label: t('p4000:menu'),      value: '_menu',     divider: true},
                 {label: t('p4000:file'),      value: 'file',      icon: 'fa-file'}
             ];
        }
        return [
            {label: t('p4000:menu'),      value: '_menu',     divider: true},
            {label: t('p4000:file'),      value: 'file',      icon: 'fa-file'},
            {label: t('p4000:view'),      value: 'view',      icon: 'fa-eye'},
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

        let activeItem  = editMode && event ? event.type : page;
        let Component   = components[activeItem];

        return <TopContainer className='topContainer'>
            <Nav.Row>
                <Nav.Column style={{maxWidth: '300px', padding: 0}}>
                    <h1 className='mt-4 ml-3 mb-2 appTitle'>{t('p4000:app-title')}</h1>
                    <SideMenu activeItem={activeItem} items={this.getItems()} theme={'nav' + (editMode ? ' Side-menu-nav-edit' : '')}
                        shouldTriggerClickOnParents={false}
                        onMenuItemClick={this.handleMenuItemClick.bind(this)}/>
                </Nav.Column>
                <Nav.Column className='row-eventForm'>
                    <EventForm type={activeItem} Component={Component}/>
                </Nav.Column>
            </Nav.Row>
        </TopContainer>
    }
}

P4000.propTypes = {
    history      : PT.object,
    t            : PT.func,
    page         : PT.string.isRequired,
    match        : PT.object.isRequired,
    events       : PT.array.isRequired,
    editMode     : PT.bool,
    event        : PT.object,
    actions      : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(P4000)
);
