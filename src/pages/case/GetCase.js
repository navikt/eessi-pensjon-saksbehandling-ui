import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import Case from './Case';

import * as Nav from '../../components/ui/Nav';
import * as routes from '../../constants/routes';
import * as caseActions from '../../actions/case';
import * as uiActions from '../../actions/ui';

const mapStateToProps = (state) => {
    return {
        currentCase : state.case.currentCase,
        gettingCase : state.loading.gettingCase
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, caseActions, uiActions), dispatch)};
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

        const { actions } = this.props;

        actions.navigateForward();
        actions.getCaseFromCaseNumber(this.state);
    }

    componentDidMount() {

        const { actions } = this.props;

        actions.addToBreadcrumbs({
            url  : routes.CASE_GET,
            ns   : 'case',
            label: 'case:app-getCaseTitle'
        });
    }

    componentDidUpdate() {

        const { history, currentCase } = this.props;

        if (currentCase) {
            history.push(routes.CASE_GET  +
                (currentCase.casenumber ? '/' + currentCase.casenumber : '') +
                (currentCase.pinid      ? '/' + currentCase.pinid      : '') +
                (currentCase.rinaid     ? '/' + currentCase.rinaid     : '')
            );
        }
    }

    isButtonDisabled() {
        return !this.state.caseId || !this.state.actorId || this.props.gettingCase;
    }

    render() {

        const { t, gettingCase, history, location } = this.props;

        let buttonText = gettingCase ? t('case:loading-gettingCase') : t('ui:search');

        return <Case className='getcase'
            title='case:app-getCaseTitle'
            description='case:app-getCaseDescription'
            history={history}
            location={location}>
            <div className='fieldset p-4 m-4'>
                <Nav.Row>
                    <div className='col-md-6'>
                        <Nav.HjelpetekstBase id='caseId'>{t('case:help-caseId')}</Nav.HjelpetekstBase>
                        <Nav.Input className='getCaseInputCaseId' label={t('case:form-caseId') + ' *'} value={this.state.caseId} onChange={this.onCaseIdChange.bind(this)}/>
                    </div>
                    <div className='col-md-6'>
                        <Nav.HjelpetekstBase id='actorId'>{t('case:help-actorId')}</Nav.HjelpetekstBase>
                        <Nav.Input className='getCaseInputActorId' label={t('case:form-actorId') + ' *'} value={this.state.actorId} onChange={this.onActorIdChange.bind(this)}/>
                    </div>
                    <div className='col-md-6'>
                        <Nav.HjelpetekstBase id='rinaId'>{t('case:help-rinaId')}</Nav.HjelpetekstBase>
                        <Nav.Input className='getCaseInputRinaId' label={t('case:form-rinaId')} value={this.state.rinaId} onChange={this.onRinaIdChange.bind(this)}/>
                    </div>
                </Nav.Row>
            </div>
            <Nav.Row className='p-4'>
                <div className='col-md-6 mb-2'/>
                <div className='col-md-6 mb-2'>
                    <Nav.Hovedknapp className='forwardButton w-100'
                        spinner={gettingCase}
                        disabled={this.isButtonDisabled()}
                        onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                </div>
            </Nav.Row>
        </Case>
    }
}

GetCase.propTypes = {
    currentCase  : PT.object,
    gettingCase  : PT.bool,
    actions      : PT.object,
    history      : PT.object,
    location     : PT.object,
    t            : PT.func
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(GetCase)
);
