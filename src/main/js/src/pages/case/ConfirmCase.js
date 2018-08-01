import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import StepIndicator from '../../components/case/StepIndicator';
import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';
import RenderConfirmData from '../../components/case/RenderConfirmData';

import * as usercaseActions from '../../actions/usercase';
import * as uiActions from '../../actions/ui';

const mapStateToProps = (state) => {
    return {
        dataToConfirm  : state.usercase.dataToConfirm,
        dataToGenerate : state.usercase.dataToGenerate,
        errorMessage   : state.alert.clientErrorMessage,
        errorStatus    : state.alert.clientErrorStatus,
        action         : state.ui.action,
        language       : state.ui.language,
        generatingCase : state.loading.generatingCase
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, usercaseActions, uiActions), dispatch)};
};

class ConfirmCase extends Component {

    componentDidMount() {

        let { history, dataToConfirm } = this.props;

        if (!dataToConfirm) {
            history.push('/');
        }
    }

    componentDidUpdate() {

        const { history, dataToGenerate, action } = this.props;

        if (dataToGenerate && action === 'forward') {
            history.push('/react/case/generate');
        }
    }

    onBackButtonClick() {

        const { history, actions, dataToConfirm } = this.props;

        actions.navigateBack();
        history.push('/react/case/get/' + dataToConfirm.caseId + '/' + dataToConfirm.actorId);
    }

    onForwardButtonClick() {

        const { actions, dataToConfirm } = this.props;

        actions.navigateForward();
        actions.generateData({
            subjectArea   : dataToConfirm.subjectArea,
            caseId        : dataToConfirm.caseId,
            actorId       : dataToConfirm.actorId,
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

        let buttonText = generatingCase ? t('case:loadingGeneratingCase') : t('ui:confirmAndGenerate');

        if (errorStatus) {
            alert = <Nav.AlertStripe type='stopp'>{t(errorMessage)}</Nav.AlertStripe>;
        }

        return <TopContainer>
            <Nav.Panel>
                <Nav.Row className='mt-4'>
                    <Nav.Column>
                        <h1 className='mt-3 appTitle'>{t('case:confirmCaseTitle')}</h1>
                        <h4>{t('case:confirmCaseDescription')}</h4>
                    </Nav.Column>
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
                        <RenderConfirmData dataToConfirm={dataToConfirm}/>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4'>
                    <Nav.Column>
                        <Nav.Knapp className='mr-4 backButton' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp>
                        <Nav.Hovedknapp className='forwardButton' disabled={generatingCase} spinner={generatingCase} onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                    </Nav.Column>
                </Nav.Row>
            </Nav.Panel>
        </TopContainer>;
    }
}

ConfirmCase.propTypes = {
    actions        : PT.object.isRequired,
    history        : PT.object.isRequired,
    generatingCase : PT.bool,
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
