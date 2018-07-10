import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import StepIndicator from '../components/StepIndicator';
import * as Nav from '../components/Nav';
import TopContainer from '../components/TopContainer';
import RenderGeneratedData from '../components/RenderGeneratedData';

import * as usercaseActions from '../actions/usercase';
import * as uiActions from '../actions/ui';

const mapStateToProps = (state) => {
    return {
        dataToConfirm  : state.usercase.dataToConfirm,
        dataToGenerate : state.usercase.dataToGenerate,
        dataSubmitted  : state.usercase.dataSubmitted,
        errorMessage   : state.error.clientErrorMessage,
        errorStatus    : state.error.clientErrorStatus,
        sendingCase    : state.loading.sendingCase,
        language       : state.ui.language,
        action         : state.ui.action
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, usercaseActions, uiActions), dispatch)};
};

class GenerateCase extends Component {

    componentWillMount() {

        let { history, dataToGenerate } = this.props;

        if (!dataToGenerate) {
            history.push('/');
        }
    }

    componentWillReceiveProps(nextProps) {

        const { history } = this.props;
        if (nextProps.dataSubmitted && nextProps.action === 'forward') {
            history.push('/react/end');
        }
    }

    onBackButtonClick() {

        const { history, actions } = this.props;

        actions.navigateBack();
        history.push('/react/confirm')
    }

    onButtonClick() {

        const { actions, dataToConfirm, dataToGenerate } = this.props;

        actions.navigateForward();
        actions.submitData({
            subjectArea   : dataToConfirm.subjectArea,
            caseId        : dataToConfirm.caseId,
            buc           : dataToConfirm.buc,
            sed           : dataToConfirm.sed,
            institutions  : dataToConfirm.institutions
        });
    }

    render() {

        const { t, dataToGenerate, dataToConfirm, errorStatus, errorMessage, sendingCase } = this.props;

        if (!dataToGenerate) {
            return <TopContainer/>
        }

        let alert;
        let buttonText = sendingCase ? t('loading:sendingCase') : t('ui:confirmAndSend');

        if (dataToGenerate) {
            alert = <Nav.AlertStripe type='suksess'>{t('ui:dataGenerated')}</Nav.AlertStripe>
        }

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
                        <StepIndicator activeStep={2}/>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 mb-4 text-left'>
                    <Nav.Column>
                        <RenderGeneratedData dataToGenerate={dataToGenerate} dataToConfirm={dataToConfirm}/>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4'>
                    <Nav.Column>
                        <Nav.Knapp className='mr-4' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp>
                        <Nav.Hovedknapp spinner={sendingCase} onClick={this.onButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                    </Nav.Column>
                </Nav.Row>
            </Nav.Panel>
        </TopContainer>;
    }
}

GenerateCase.propTypes = {
    actions        : PT.object.isRequired,
    history        : PT.object.isRequired,
    sendingCase    : PT.bool.isRequired,
    t              : PT.func.isRequired,
    dataToConfirm  : PT.object,
    dataToGenerate : PT.object.isRequired,
    dataSubmitted  : PT.object,
    errorStatus    : PT.string,
    errorMessage   : PT.string,
    action         : PT.string
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(GenerateCase)
);
