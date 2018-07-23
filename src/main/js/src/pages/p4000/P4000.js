import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import { SideMenu } from 'react-sidemenu';

import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';
import FormEvent from '../../components/p4000/FormEvent';

import * as Steps from './steps';
import * as Views from './views';

import * as p4000Actions from '../../actions/p4000';

import '@fortawesome/fontawesome-free/css/all.css';
import 'react-sidemenu/dist/react-sidemenu.min.css';
import './sidemenu.css';

const mapStateToProps = (state) => {
    return {
        errorMessage : state.error.clientErrorMessage,
        errorStatus  : state.error.clientErrorStatus,
        gettingCase  : state.loading.gettingCase,
        form         : state.p4000.form,
        editFormEvent: state.p4000.editFormEvent
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
    timeline: Views.Timeline
}

const style = {
    menu: {
        backgroundColor: 'white'
    }
}

class P4000 extends Component {

    state = {
       currentType: 'work'
    };

    handleMenuItemClick(newType, extras) {

        this.setState({currentType : newType});
    }

    getItems() {

        const { t } = this.props;

        return [
      	{divider: true, label: t('content:p4000_period'), value: 'steps'},
      	{label: t('content:p4000-work'), value: 'work', icon: 'fa-briefcase'},
      	{label: t('content:p4000-botid'), value: 'home', icon: 'fa-home'},
      	{label: t('content:p4000-child'), value: 'child', icon: 'fa-child'},
      	{label: t('content:p4000-voluntary'), value: 'voluntary', icon: 'fa-hands-helping'},
      	{label: t('content:p4000-military'), value: 'military', icon: 'fa-fighter-jet'},
      	{label: t('content:p4000-birth'), value: 'birth', icon: 'fa-money-bill-wave'},
      	{label: t('content:p4000-learn'), value: 'learn', icon: 'fa-school'},
      	{label: t('content:p4000-daily'), value: 'daily', icon: 'fa-hand-holding-usd'},
      	{label: t('content:p4000-sick'), value: 'sick', icon: 'fa-h-square'},
      	{label: t('content:p4000-other'), value: 'other', icon: 'fa-calendar'},
        {divider: true, label: 'Other', value: 'views'},
      	{label: t('content:p4000-timeline'), value: 'timeline', icon: 'fa-calendar-check'}
        ];
    }

    renderExistingOnes(form, editFormEvent) {

        return form.map((event, index) => {
            let selected = false;
            if (editFormEvent && editFormEvent.index === index) {
                selected = true;
            }
            return <FormEvent event={event} index={index} selected={selected}/>
        });
    }

    render() {

        const { t, errorMessage, errorStatus, gettingPDF, form, editFormEvent } = this.props;

        let alert      = errorStatus ? <Nav.AlertStripe type='stopp'>{t('error:' + errorMessage)}</Nav.AlertStripe> : null;
        let buttonText = gettingPDF ? t('loading:gettingPDF') : t('ui:forward');

        let currentType = (editFormEvent ? editFormEvent.type : this.state.currentType);

        return <TopContainer>
            <Nav.Row className='no-gutters'>
                <Nav.Column className='col-3' styles={style.menu}>
                    <SideMenu activeItem={currentType} items={this.getItems()} theme='nav' shouldTriggerClickOnParents={true} onMenuItemClick={this.handleMenuItemClick.bind(this)}/>
                </Nav.Column>
                <Nav.Column>
                    <Nav.Panel className='h-100'>
                        <Nav.Row className='text-center'>
                            <Nav.Column>{alert}</Nav.Column>
                        </Nav.Row>
                        {(() => {
                            if (currentType !== 'timeline') {
                                return <Nav.Row>
                                    <Nav.Column>
                                        {this.renderExistingOnes(form, editFormEvent)}
                                    </Nav.Column>
                                </Nav.Row>
                            }
                        })()}
                        <Nav.Row>
                            <Nav.Column>
                            {(() => {
                                const Comp = components[currentType];
                                return <Comp/>;
                             })()}
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
    pdfs         : PT.array.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(P4000)
);
