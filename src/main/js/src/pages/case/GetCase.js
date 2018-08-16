import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import Case from './Case';
import * as Nav from '../../components/ui/Nav';

import * as usercaseActions from '../../actions/usercase';
import * as uiActions from '../../actions/ui';

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

    onRinaIdChange (e) {

        this.setState({
            rinaId: e.target.value
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

        if (currentCase) {
            history.push('/react/case/get/' +
                (currentCase.hasOwnProperty('casenumber') ? currentCase.casenumber + '/' : null) +
                (currentCase.hasOwnProperty('pinid')      ? currentCase.pinid      + '/' : null) +
                (currentCase.hasOwnProperty('rinaid')     ? currentCase.rinaid     + '/' : null)
            );
        }
    }

    isButtonDisabled() {
        return !this.state.caseId || !this.state.actorId || this.props.gettingCase;
    }

    render() {

        const { t, gettingCase, history } = this.props;

        let buttonText = gettingCase ? t('case:loading-gettingCase') : t('ui:search');

        return <Case className='getcase'
            title='case:app-getCaseTitle'
            description='case:app-getCaseDescription'
            history={history}>
            <div className='fieldset p-4 m-4'>
                <Nav.Row>
                    <Nav.Column>
                        <Nav.HjelpetekstBase id='caseId'>{t('case:help-caseId')}</Nav.HjelpetekstBase>
                        <Nav.Input className='getCaseInputCaseId' label={t('case:form-caseId') + ' *'} value={this.state.caseId} onChange={this.onCaseIdChange.bind(this)}/>
                        <div>&nbsp;</div>
                        <Nav.HjelpetekstBase id='actorId'>{t('case:help-actorId')}</Nav.HjelpetekstBase>
                        <Nav.Input className='getCaseInputActorId' label={t('case:form-actorId') + ' *'} value={this.state.actorId} onChange={this.onActorIdChange.bind(this)}/>
                        <div>&nbsp;</div>
                        <Nav.HjelpetekstBase id='rinaId'>{t('case:help-rinaId')}</Nav.HjelpetekstBase>
                        <Nav.Input className='getCaseInputRinaId' label={t('case:form-rinaId')} value={this.state.rinaId} onChange={this.onRinaIdChange.bind(this)}/>
                    </Nav.Column>
                </Nav.Row>
            </div>
            <Nav.Row className='p-2 mb-4'>
                <Nav.Column/>
                <Nav.Column>
                    <Nav.Hovedknapp className='forwardButton w-100'
                        spinner={gettingCase}
                        disabled={this.isButtonDisabled()}
                        onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                </Nav.Column>
            </Nav.Row>
        </Case>
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
