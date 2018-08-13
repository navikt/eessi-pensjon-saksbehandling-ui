import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import StepIndicator from '../../components/case/StepIndicator';
import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';
import RenderConfirmData from '../../components/case/RenderConfirmData';
import Icons from '../../components/ui/Icons';
import ClientAlert from '../../components/ui/Alert/ClientAlert';

import * as usercaseActions from '../../actions/usercase';
import * as uiActions from '../../actions/ui';

import './case.css';

const mapStateToProps = (state) => {
    return {
        dataToConfirm  : state.usercase.dataToConfirm,
        dataToGenerate : state.usercase.dataToGenerate,
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

        const { t, history, dataToConfirm, generatingCase } = this.props;

        if (!dataToConfirm) {
            return <TopContainer/>
        }

        let buttonText = generatingCase ? t('case:loading-generatingCase') : t('ui:confirmAndGenerate');

        return <TopContainer className='case topContainer'>
            <Nav.Row className='mb-4'>
                <Nav.Column>
                    <h1 className='mb-3 appTitle'>
                        <Icons title={t('ui:back')} className='mr-3' style={{cursor: 'pointer'}} kind='caretLeft' onClick={() => history.push('/')}/>
                        {t('case:app-confirmCaseTitle')}
                    </h1>
                    <h4>{t('case:app-confirmCaseDescription')}</h4>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='mb-4 text-center'>
                <Nav.Column>
                    <ClientAlert className='mb-3'/>
                    <StepIndicator activeStep={1}/>
                </Nav.Column>
            </Nav.Row>
            <div className='fieldset p-4 mb-4 ml-3 mr-3'>
                <Nav.Row>
                    <Nav.Column>
                        <RenderConfirmData dataToConfirm={dataToConfirm}/>
                    </Nav.Column>
                </Nav.Row>
            </div>
            <Nav.Row className='mb-4 p-2'>
                <Nav.Column>
                    <Nav.Knapp className='w-100 backButton' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp>
                </Nav.Column>
                <Nav.Column>
                    <Nav.Hovedknapp className='w-100 forwardButton' disabled={generatingCase} spinner={generatingCase} onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                </Nav.Column>
            </Nav.Row>
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
    dataToGenerate : PT.object
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(ConfirmCase)
);
