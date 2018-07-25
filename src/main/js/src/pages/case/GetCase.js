import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';

import * as usercaseActions from '../../actions/usercase';
import * as uiActions from '../../actions/ui';

const mapStateToProps = (state) => {
    return {
        errorMessage : state.error.clientErrorMessage,
        errorStatus  : state.error.clientErrorStatus,
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

        this.setState({caseId: e.target.value});
    }

    onActorIdChange (e) {

        this.setState({actorId: e.target.value});
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

        const { t, errorMessage, errorStatus, gettingCase } = this.props;

        let alert      = errorStatus ? <Nav.AlertStripe type='stopp'>{t(errorMessage)}</Nav.AlertStripe> : null;
        let buttonText = gettingCase ? t('case:loadingGettingCase') : t('ui:search');

        return <TopContainer>
            <Nav.Panel className='panel'>
                <Nav.Row className='mt-4'>
                    <Nav.Column>
                      <h1 className='mt-3 appTitle'>{t('case:getCaseTitle')}</h1>
                      <h4>{t('case:getCaseDescription')}</h4>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 text-center'>
                    <Nav.Column>{alert}</Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 text-left'>
                    <Nav.Column>
                        <Nav.Input className='getCaseInputCaseId' label={t('case:caseId')} value={this.state.caseId} onChange={this.onCaseIdChange.bind(this)}/>
                    </Nav.Column>
                    <Nav.Column className='mt-4'>
                        <Nav.HjelpetekstBase id='caseId' type='under'>{t('case:helpCaseId')}</Nav.HjelpetekstBase>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row  className='mt-4 text-left'>
                    <Nav.Column>
                        <Nav.Input className='getCaseInputActorId' label={t('case:actorId')} value={this.state.actorId} onChange={this.onActorIdChange.bind(this)}/>
                    </Nav.Column>
                    <Nav.Column className='mt-4'>
                        <Nav.HjelpetekstBase id='actorId' type='under'>{t('case:helpActorId')}</Nav.HjelpetekstBase>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4'>
                    <Nav.Column>
                        <Nav.Hovedknapp className='forwardButton' spinner={gettingCase} disabled={this.isButtonDisabled()} onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                    </Nav.Column>
                </Nav.Row>
            </Nav.Panel>
        </TopContainer>
    }
}

GetCase.propTypes = {
    currentCase  : PT.object,
    errorMessage : PT.string,
    errorStatus  : PT.string,
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
