import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import StepIndicator from '../components/StepIndicator';
import * as Nav from '../components/Nav';
import TopContainer from '../components/TopContainer';

import * as usercaseActions from '../actions/usercase';
import * as uiActions from '../actions/ui';

const mapStateToProps = (state) => {
    return {
        dataToConfirm  : state.usercase.dataToConfirm,
        dataToGenerate : state.usercase.dataToGenerate,
        errorMessage   : state.error.clientErrorMessage,
        errorStatus    : state.error.clientErrorStatus,
        action         : state.ui.action,
        language       : state.ui.language,
        generatingCase : state.loading.generatingCase
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, usercaseActions, uiActions), dispatch)};
};

class ConfirmCase extends Component {

    componentWillMount() {

        let { history, dataToConfirm } = this.props;

        if (!dataToConfirm) {
            history.push('/');
        }
    }

    componentWillReceiveProps(nextProps) {

        const { history, action } = this.props;
        if (nextProps.dataToGenerate && action === 'forward') {
            history.push('/react/generate');
        }
    }

    onBackButtonClick() {

        const { history, actions, dataToConfirm } = this.props;
        actions.navigateBack();
        history.push('/react/get/' + dataToConfirm.caseId);
    }

    onButtonClick() {

        const { actions, dataToConfirm } = this.props;

        actions.navigateForward();
        actions.generateData({
            subjectArea   : dataToConfirm.subjectArea,
            caseId        : dataToConfirm.caseId,
            buc           : dataToConfirm.buc,
            sed           : dataToConfirm.sed,
            institutions  : dataToConfirm.institutions
        });
    }

    render() {

        const { t, dataToConfirm, errorStatus, errorMessage, generatingCase } = this.props;

        if (!dataToConfirm) {
            return <TopContainer/>
        }

        let alert;

        let buttonText = generatingCase ? t('loading:generatingCase') : t('ui:confirmAndGenerate');

        if (errorStatus) {
            alert = <Nav.AlertStripe type='stopp'>{t('error:' + errorMessage)}</Nav.AlertStripe>;
        }

        return <TopContainer>
            <Nav.Panel>
                <Nav.Row className='mt-4'>
                    <Nav.Column>{t('content:confirmCaseDescription')}</Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 text-center'>
                    <Nav.Column>{alert}</Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 text-center'>
                    <Nav.Column>
                        <StepIndicator activeStep={1}/>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 mb-4 text-left'>
                    <Nav.Column>
                        <div>{t('ui:caseId')}: {dataToConfirm.caseId}</div>
                        <div>{t('ui:subjectArea')}: {dataToConfirm.subjectArea}</div>
                        <div>{t('ui:buc')}: {dataToConfirm.buc}</div>
                        <div>{t('ui:sed')}: {dataToConfirm.sed}</div>
                        <div>{t('ui:institutions')}: {JSON.stringify(dataToConfirm.institutions)}</div>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4'>
                    <Nav.Column>
                        <Nav.Knapp className='mr-4' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp>
                        <Nav.Hovedknapp spinner={generatingCase} onClick={this.onButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                    </Nav.Column>
                </Nav.Row>
            </Nav.Panel>
        </TopContainer>;
    }
}

ConfirmCase.propTypes = {
    actions        : PT.object.isRequired,
    history        : PT.object.isRequired,
    loading        : PT.object.isRequired,
    t              : PT.func.isRequired,
    dataToConfirm  : PT.object.isRequired,
    action         : PT.string,
    dataToGenerate : PT.object,
    errorStatus    : PT.string,
    errorMessage   : PT.string
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(ConfirmCase)
);
