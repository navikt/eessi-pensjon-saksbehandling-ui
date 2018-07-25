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

const mapStateToProps = (state) => {
    return {
        events   : state.p4000.events,
        editMode : state.p4000.editMode,
        event    : state.p4000.event
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

class P4000 extends Component {

    state = {
        page: 'work'
    };

    handleMenuItemClick(newPage, extras) {

        this.setState({page : newPage});
    }

    getItems() {

        const { t } = this.props;

        return [
            {label: t('content:p4000-views'),     value: 'views',     divider: true},
            {label: t('content:p4000-timeline'),  value: 'timeline',  icon: 'fa-calendar-check'},
            {label: t('content:p4000-file'),      value: 'file',      icon: 'fa-file'},
            {label: t('content:p4000-events'),    value: 'events',    divider: true, },
            {label: t('content:p4000-work'),      value: 'work',      icon: 'fa-briefcase'},
            {label: t('content:p4000-home'),      value: 'home',      icon: 'fa-home'},
            {label: t('content:p4000-child'),     value: 'child',     icon: 'fa-child'},
            {label: t('content:p4000-voluntary'), value: 'voluntary', icon: 'fa-hands-helping'},
            {label: t('content:p4000-military'),  value: 'military',  icon: 'fa-fighter-jet'},
            {label: t('content:p4000-birth'),     value: 'birth',     icon: 'fa-money-bill-wave'},
            {label: t('content:p4000-learn'),     value: 'learn',     icon: 'fa-school'},
            {label: t('content:p4000-daily'),     value: 'daily',     icon: 'fa-hand-holding-usd'},
            {label: t('content:p4000-sick'),      value: 'sick',      icon: 'fa-h-square'},
            {label: t('content:p4000-other'),     value: 'other',     icon: 'fa-calendar'}
        ];
    }

    render() {

        const { editMode, event} = this.props;

        let alert = null;
        let page  = editMode && event ? event.type : this.state.page;

        return <TopContainer>
            <Nav.Row className='no-gutters'>
                <Nav.Column className='col-3' style={styles.menu}>
                    <SideMenu activeItem={page} items={this.getItems()} theme='nav'
                        shouldTriggerClickOnParents={false} onMenuItemClick={this.handleMenuItemClick.bind(this)}/>
                </Nav.Column>
                <Nav.Column>
                    <Nav.Panel className='h-100'>
                        <Nav.Row>
                            <Nav.Column>{alert}</Nav.Column>
                        </Nav.Row>
                        <Nav.Row>
                            <Nav.Column>
                                <EventForm type={page}/>
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
