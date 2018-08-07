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

        this.setState({
            isLoaded : true
        })
    }

    handleEventSelect(newPage) {

        const { actions } = this.props;
        actions.setPage(newPage);
    }

    render() {

        const { t, editMode, event, page, history } = this.props;

        if (!this.state.isLoaded) {
            return null;
        }

        let activeItem  = editMode && event ? event.type : page;
        let Component   = components[activeItem];

        return <TopContainer className='topContainer'>
            <Nav.Row>
                <Nav.Column>
                    <h1 className='mt-4 ml-3 mb-2 appTitle'>
                        <Icons title={t('ui:back')} className='mr-3' style={{cursor: 'pointer'}} kind='caretLeft' onClick={() => history.push('/')}/>
                        {t('p4000:app-title')}
                    </h1>
                </Nav.Column>
                <Nav.Column className='text-right'>
                    <div>
                         <Nav.Knapp className='mt-4' onClick={this.handleEventSelect.bind(this, 'file')}>{t('p4000:menu-file')}</Nav.Knapp>
                    </div>
                </Nav.Column>
            </Nav.Row>
            <EventForm type={activeItem} Component={Component}/>
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
