import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import StepIndicator from '../../components/case/StepIndicator';
import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';
import RenderGeneratedData from '../../components/case/RenderGeneratedData';
import Icons from '../../components/ui/Icons';
import ClientAlert from '../../components/ui/Alert/ClientAlert';

import * as usercaseActions from '../../actions/usercase';
import * as uiActions from '../../actions/ui';

import './case.css';

const mapStateToProps = (state) => {
    return {
        dataToConfirm  : state.usercase.dataToConfirm,
        dataToGenerate : state.usercase.dataToGenerate,
        dataSubmitted  : state.usercase.dataSubmitted,
        sendingCase    : state.loading.sendingCase,
        language       : state.ui.language,
        action         : state.ui.action
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, usercaseActions, uiActions), dispatch)};
};

class GenerateCase extends Component {

    componentDidMount() {

        let { history, dataToGenerate } = this.props;

        if (!dataToGenerate) {
            history.push('/');
        }
    }

    componentDidUpdate() {

        const { history, dataSubmitted, action } = this.props;

        if (dataSubmitted && action === 'forward') {
            history.push('/react/case/end');
        }
    }

    onBackButtonClick() {

        const { history, actions } = this.props;

        actions.navigateBack();
        history.push('/react/case/confirm')
    }

    onButtonClick() {

        const { actions, dataToConfirm, dataToGenerate } = this.props;

        actions.navigateForward();
        actions.submitData({
            subjectArea   : dataToConfirm.subjectArea,
            caseId        : dataToConfirm.caseId,
            actorId       : dataToConfirm.actorId,
            buc           : dataToConfirm.buc,
            sed           : dataToConfirm.sed,
            institutions  : dataToConfirm.institutions
        });
    }

    render() {

        const { t, history, dataToGenerate, dataToConfirm, sendingCase } = this.props;

        if (!dataToGenerate) {
            return <TopContainer/>
        }

        let buttonText = sendingCase ? t('case:loading-sendingCase') : t('ui:confirmAndSend');

        return <TopContainer className='case topContainer'>
            <Nav.Row className='mb-4'>
                <Nav.Column>
                    <h1 className='mb-3 appTitle'>
                        <Icons title={t('ui:back')} className='mr-3' style={{cursor: 'pointer'}} kind='caretLeft' onClick={() => history.push('/')}/>
                        {t('case:app-generateCaseTitle')}
                    </h1>
                    <h4>{t('case:app-generateCaseDescription')}</h4>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='mb-4 text-center'>
                <Nav.Column>
                    <ClientAlert className='mb-3'/>
                    <StepIndicator activeStep={2}/>
                </Nav.Column>
            </Nav.Row>
            <div className='fieldset p-4 mb-4 ml-3 mr-3'>
                <Nav.Row>
                    <Nav.Column>
                        <RenderGeneratedData dataToGenerate={dataToGenerate} dataToConfirm={dataToConfirm}/>
                    </Nav.Column>
                </Nav.Row>
            </div>
            <Nav.Row>
                <Nav.Column>
                    <Nav.Knapp className='w-100 backButton' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp>
                </Nav.Column>
                <Nav.Column>
                    <Nav.Hovedknapp className='w-100 forwardButton' disabled={sendingCase} spinner={sendingCase} onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                </Nav.Column>
            </Nav.Row>
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
    action         : PT.string
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(GenerateCase)
);
