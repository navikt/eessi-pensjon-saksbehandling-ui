import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { SideMenu } from 'react-sidemenu';

import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';
import SelectedPDF from '../../components/pdf/SelectedPDF';

import * as pdfActions from '../../actions/pdf';
import * as uiActions from '../../actions/ui';

import * as Steps from './steps';

import '@fortawesome/fontawesome-free/css/all.css';
import 'react-sidemenu/dist/react-sidemenu.min.css';
import './sidemenu.css';

const mapStateToProps = (state) => {
    return {
        errorMessage : state.error.clientErrorMessage,
        errorStatus  : state.error.clientErrorStatus,
        gettingCase  : state.loading.gettingCase,
        language     : state.ui.language,
        form         : state.p4000.form
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, uiActions, pdfActions), dispatch)};
};

const items = [
  	{divider: true, label: 'Perioder', value: 'main-nav'},
  	{label: 'Ansatt / selvstending', value: 'work', icon: 'fa-briefcase'},
  	{label: 'Botid', value: 'home', icon: 'fa-home'},
  	{label: 'Omsorg for barn', value: 'child', icon: 'fa-child'},
  	{label: 'Friville forsikring', value: 'voluntary', icon: 'fa-hands-helping'},
  	{label: 'Militærtjeneste', value: 'military', icon: 'fa-fighter-jet'},
  	{label: 'Fødselspenger', value: 'birth', icon: 'fa-money-bill-wave'},
  	{label: 'Opplæring', value: 'learn', icon: 'fa-school'},
  	{label: 'Dagpenger', value: 'daily', icon: 'fa-hand-holding-usd'},
  	{label: 'Sykepenger', value: 'sick', icon: 'fa-h-square'},
  	{label: 'Andre typer', value: 'other', icon: 'fa-calendar'},
    {divider: true, label: 'Other', value: 'timeline-nav'},
  	{label: 'Timeline', value: 'timeline', icon: 'fa-calendar-check'}
  ];


class P4000 extends Component {

    state = {
       menu: 'work'
    };


    componentDidUpdate() {}

    handleForwardButtonClick() {}

    handleMenuItemClick(value, extras) {
        console.log(value)
        this.setState({menu : value});
    }

    renderBody(type) {

        switch(type) {

            case 'start': return <Steps.Start/>
            case 'work': return <Steps.Work/>
            case 'home': return <Steps.Home/>
            case 'child': return <Steps.Child/>
            case 'voluntary': return <Steps.Voluntary/>
            case 'military': return <Steps.Military/>
            case 'birth': return <Steps.Birth/>
            case 'learn': return <Steps.Learn/>
            case 'daily': return <Steps.Daily/>
            case 'sick': return <Steps.Sick/>
            case 'other': return <Steps.Other/>

            default: return <Steps.Start/>
        }

    }

    render() {

        const { t, errorMessage, errorStatus, gettingPDF } = this.props;

        let alert      = errorStatus ? <Nav.AlertStripe type='stopp'>{t('error:' + errorMessage)}</Nav.AlertStripe> : null;
        let buttonText = gettingPDF ? t('loading:gettingPDF') : t('ui:forward');

        let body = this.renderBody(this.state.menu);

        return <TopContainer>
            <Nav.Row className='no-gutters'>
                <Nav.Column className='col-3'>
                    <SideMenu activeItem={this.state.menu} items={items} theme='nav' shouldTriggerClickOnParents={true} onMenuItemClick={this.handleMenuItemClick.bind(this)}/>
                </Nav.Column>
                <Nav.Column>
                    <Nav.Panel className='h-100'>
                        <Nav.Row className='mt-4 text-center'>
                            <Nav.Column>{alert}</Nav.Column>
                        </Nav.Row>
                        <Nav.Row className='mt-4 text-left'>
                            <Nav.Column>
                                {body}
                            </Nav.Column>
                        </Nav.Row>
                        <Nav.Row className='mt-4'>
                            <Nav.Column>
                                <Nav.Hovedknapp className='forwardButton' spinner={gettingPDF} onClick={this.handleForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
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
    actions      : PT.object,
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
