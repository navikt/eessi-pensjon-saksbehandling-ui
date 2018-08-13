import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import * as Nav from '../../components/ui/Nav';
import Icons from '../../components/ui/Icons';
import TopContainer from '../../components/ui/TopContainer';
import ClientAlert from '../../components/ui/Alert/ClientAlert';

import * as usercaseActions from '../../actions/usercase';
import * as uiActions from '../../actions/ui';

import './case.css';

const mapStateToProps = (state) => {
    return {
        currentCase  : state.usercase.currentCase,
        gettingCase  : state.loading.gettingCase,
        language     : state.ui.language
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, usercaseActions, uiActions), dispatch)};
};

class GetCase extends Component {

    state = {};

    onCaseIdChange (e) {

        this.setState({
            caseId: e.target.value
        });
    }

    onActorIdChange (e) {

        this.setState({
            actorId: e.target.value
        });
    }

    onForwardButtonClick() {

        const {actions} = this.props;
        actions.navigateForward();
        actions.getCaseFromCaseNumber(this.state);
    }

    componentDidUpdate() {

        const { history, currentCase } = this.props;
        if (currentCase && currentCase.hasOwnProperty('casenumber') && currentCase.hasOwnProperty('pinid')) {
            history.push('/react/case/get/' + currentCase.casenumber + '/' + currentCase.pinid);
        }
    }

    isButtonDisabled() {
        return !this.state.caseId || !this.state.actorId || this.props.gettingCase;
    }

    render() {

        const { t, history, gettingCase } = this.props;

        let buttonText = gettingCase ? t('case:loading-gettingCase') : t('ui:search');

        return <TopContainer className='case topContainer'>
            <Nav.Row className='mb-4'>
                <Nav.Column>
                    <h1 className='mb-3 appTitle'>
                        <Icons title={t('ui:back')} className='mr-3' style={{cursor: 'pointer'}} kind='caretLeft' onClick={() => history.push('/')}/>
                        {t('case:app-getCaseTitle')}
                    </h1>
                    <h4 className='mb-3'>{t('case:app-getCaseDescription')}</h4>
                    <ClientAlert/>
                </Nav.Column>
            </Nav.Row>
            <div className='fieldset p-4 m-4'>
                <Nav.Row>
                    <Nav.Column>
                        <Nav.HjelpetekstBase id='caseId'>{t('case:help-caseId')}</Nav.HjelpetekstBase>
                        <Nav.Input className='getCaseInputCaseId' label={t('case:form-caseId')} value={this.state.caseId} onChange={this.onCaseIdChange.bind(this)}/>
                        <div>&nbsp;</div>
                        <Nav.HjelpetekstBase id='actorId'>{t('case:help-actorId')}</Nav.HjelpetekstBase>
                        <Nav.Input className='getCaseInputActorId' label={t('case:form-actorId')} value={this.state.actorId} onChange={this.onActorIdChange.bind(this)}/>
                    </Nav.Column>
                </Nav.Row>
            </div>
            <Nav.Row className='mb-4'>
                <Nav.Column>
                    <Nav.Hovedknapp className='forwardButton w-100'
                        spinner={gettingCase}
                        disabled={this.isButtonDisabled()}
                        onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                </Nav.Column>
            </Nav.Row>
        </TopContainer>
    }
}

GetCase.propTypes = {
    currentCase  : PT.object,
    gettingCase  : PT.bool,
    actions      : PT.object,
    history      : PT.object,
    t            : PT.func
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(GetCase)
);
