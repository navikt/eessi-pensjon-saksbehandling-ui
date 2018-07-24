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
import ExistingEvents from '../../components/p4000/ExistingEvents';
import EventForm from '../../components/p4000/EventForm';

import * as p4000Actions from '../../actions/p4000';

const mapStateToProps = (state) => {
    return {
        errorMessage : state.error.clientErrorMessage,
        errorStatus  : state.error.clientErrorStatus,
        sendingForm  : state.loading.sendingForm,
        events       : state.p4000.events
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
        currentType: 'work',
        editMode: false
    };

    componentDidMount() {
        this.checkEditStatus();
    }

    componentDidUpdate() {
        this.checkEditStatus();
    }

    checkEditStatus() {

        const { history, match, events } = this.props;

        // we want to edit an event, according to URL
        if (match.params.editid) {

            let eventIndex = parseInt(match.params.editid, 10);

            // if there is such an event to edit...
            if (events && events[eventIndex] !== undefined) {

                // set state if we don't have the event to edit there
                if (this.state.eventIndex === undefined ||
                (this.state.eventIndex !== undefined && this.state.eventIndex !== eventIndex)) {

                    this.setState({
                        eventIndex: eventIndex,
                        editMode: true,
                        event: events[eventIndex]
                    });
                }

            // no we don't have the event, the URL is obsolete
            } else {
                history.replace('/react/p4000');
            }

        // we do not want to edit events
        } else {

            // the state is obsolete, replace with non-edit one
            if (this.state.editMode === true) {

                this.setState({
                  currentType: 'work',
                  editMode: false,
                  eventIndex: undefined,
                  event: undefined
                });
            }
        }
    }

    handleMenuItemClick(newType, extras) {

        this.setState({currentType : newType});
    }

    getItems() {

        const { t } = this.props;

        return [
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
            {label: t('content:p4000-other'),     value: 'other',     icon: 'fa-calendar'},
            {label: t('content:p4000-views'),     value: 'views',     divider: true},
            {label: t('content:p4000-timeline'),  value: 'timeline',  icon: 'fa-calendar-check'}
        ];
    }

    render() {

        const { t, errorMessage, errorStatus, sendingForm, events } = this.props;

        let alert = errorStatus ? <Nav.AlertStripe type='stopp'>{t('error:' + errorMessage)}</Nav.AlertStripe> : null;
        let type = this.state.editMode && this.state.event ? this.state.event.type : this.state.currentType;

        return <TopContainer>
            <Nav.Row className='no-gutters'>
                <Nav.Column className='col-3' style={styles.menu}>
                    <SideMenu activeItem={type} items={this.getItems()} theme='nav' shouldTriggerClickOnParents={true} onMenuItemClick={this.handleMenuItemClick.bind(this)}/>
                </Nav.Column>
                <Nav.Column>
                    <Nav.Panel className='h-100'>
                        <Nav.Row className='text-center'>
                            <Nav.Column>{alert}</Nav.Column>
                        </Nav.Row>
                        {(() => {
                            if (type !== 'timeline') {
                                return <Nav.Row>
                                    <Nav.Column>
                                        <ExistingEvents events={events} eventIndex={this.state.eventIndex}/>
                                    </Nav.Column>
                                </Nav.Row>
                            }
                        })()}
                        <Nav.Row>
                            <Nav.Column>
                                <EventForm type={type} editMode={this.state.editMode} event={this.state.event} eventIndex={this.state.eventIndex}/>
                            </Nav.Column>
                        </Nav.Row>
                    </Nav.Panel>
                </Nav.Column>
            </Nav.Row>
        </TopContainer>
    }
}

P4000.propTypes = {
    errorMessage : PT.string,
    errorStatus  : PT.string,
    gettingPDF   : PT.bool,
    history      : PT.object,
    t            : PT.func,
    match        : PT.object.isRequired,
    events       : PT.array.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(P4000)
);
