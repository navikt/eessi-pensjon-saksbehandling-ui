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

import 'font-awesome/css/font-awesome.min.css';
import 'react-sidemenu/dist/react-sidemenu.min.css';
import './sidemenu.css';

const mapStateToProps = (state) => {
    return {
        errorMessage : state.error.clientErrorMessage,
        errorStatus  : state.error.clientErrorStatus,
        gettingCase  : state.loading.gettingCase,
        language     : state.ui.language,
        x         : state.p4000.x
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, uiActions, pdfActions), dispatch)};
};

const items = [
  	{divider: true, label: 'Perioder', value: 'main-nav'},
  	{label: 'Ansatt / selvstending', value: 'item1', icon: 'fa-search',
  	children: [
  		{label: 'item 1.1', value: 'item1.1', icon: 'fa-snapchat',
  		children: [
  			{label: 'item 1.1.1', value: 'item1.1.1', icon: 'fa-anchor'},
  			{label: 'item 1.1.2', value: 'item1.1.2', icon: 'fa-bar-chart'}]},
  		{label: 'item 1.2', value: 'item1.2'}]},
  	{label: 'botid', value: 'item2', icon: 'fa-automobile',
  	children: [
  		{label: 'item 2.1', value: 'item2.1',
  		children: [
  			{label: 'item 2.1.1', value: 'item2.1.1'},
  			{label: 'item 2.1.2', value: 'item2.1.2'}]},
  		{label: 'item 2.2', value: 'item2.2'}]},
  	{label: 'Omsorg for barn', value: 'item3', icon: 'fa-beer'},
  	{label: 'Friville forsikring', value: 'item4', icon: 'fa-beer'},
  	{label: 'Militærtjeneste', value: 'item6', icon: 'fa-beer'},
  	{label: 'Fødselspenger', value: 'item7', icon: 'fa-beer'},
  	{label: 'Opplæring', value: 'item8', icon: 'fa-beer'},
  	{label: 'Sykepenger', value: 'item9', icon: 'fa-beer'},
  	{label: 'Andre typer', value: 'item10', icon: 'fa-beer'},
    {divider: true, label: 'Motors', value: 'motors-nav'}

  ];


class StartP4000 extends Component {

    state = {
        pdfs: [],
        numPages: []
    };

    onForwardButtonClick() {

        const {actions} = this.props;

        actions.navigateForward();
        let pdfs = this.state.pdfs;
        let numPages = this.state.numPages;
        for (var i in pdfs) {
            pdfs[i]['numPages'] = numPages[i];
        }
        actions.selectPDF(pdfs);
    }

    componentDidUpdate() {

        const { history, pdfs } = this.props;
        if (pdfs) {
            history.push('/react/pdf/edit');
        }
    }

    handleMenuItemClick(value, extras) {
        console.log(value + ' ' + extras);
    }

    render() {

        const { t, errorMessage, errorStatus, gettingPDF } = this.props;

        let alert      = errorStatus ? <Nav.AlertStripe type='stopp'>{t('error:' + errorMessage)}</Nav.AlertStripe> : null;
        let buttonText = gettingPDF ? t('loading:gettingPDF') : t('ui:forward');

        return <TopContainer>
            <Nav.Row className='no-gutters'>
                <Nav.Column className='col-3'>
                    <SideMenu items={items} theme='nav' shouldTriggerClickOnParents={true} onMenuItemClick={this.handleMenuItemClick.bind(this)}/>
                </Nav.Column>
                <Nav.Column>
                    <Nav.Panel className='h-100'>
                        <Nav.Row className='mt-4'>
                            <Nav.Column>{t('content:startP4000')}</Nav.Column>
                        </Nav.Row>
                        <Nav.Row className='mt-4 text-center'>
                            <Nav.Column>{alert}</Nav.Column>
                        </Nav.Row>
                        <Nav.Row className='mt-4 text-left'>
                            <Nav.Column>

                            </Nav.Column>
                        </Nav.Row>
                        <Nav.Row className='mt-4'>
                            <Nav.Column>
                                <Nav.Hovedknapp className='forwardButton' spinner={gettingPDF} onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                            </Nav.Column>
                        </Nav.Row>
                    </Nav.Panel>
                </Nav.Column>
            </Nav.Row>
        </TopContainer>
    }
}

StartP4000.propTypes = {
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
    translate()(StartP4000)
);
