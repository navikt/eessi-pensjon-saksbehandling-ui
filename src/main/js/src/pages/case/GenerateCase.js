import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import Case from './Case';
import * as Nav from '../../components/ui/Nav';
import RenderGeneratedData from '../../components/case/RenderGeneratedData';

import * as usercaseActions from '../../actions/usercase';
import * as uiActions from '../../actions/ui';

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

    onForwardButtonClick() {

        const { actions, dataToConfirm } = this.props;

        let payload = {
            subjectArea   : dataToConfirm.subjectArea,
            caseId        : dataToConfirm.caseId,
            actorId       : dataToConfirm.actorId,
            euxCaseId     : dataToConfirm.rinaId,
            buc           : dataToConfirm.buc,
            sed           : dataToConfirm.sed,
            institutions  : dataToConfirm.institutions
        }

        actions.navigateForward();

        if (payload.euxCaseId) {
            actions.createSed(payload);
        } else {
            actions.addToSed(payload);
        }
    }

    render() {

        const { t, history, dataToGenerate, dataToConfirm, sendingCase } = this.props;

        if (!dataToGenerate) {
            return  <Case className='generateCase'
                title='case:app-generateCaseTitle' description='case:app-generateCaseDescription'
                stepIndicator={2} history={history}>
                <div className='w-100 text-center'>
                    <Nav.NavFrontendSpinner/>
                    <p>{t('case:loading-generatingCase')}</p>
                </div>
            </Case>
        }

        let buttonText = sendingCase ? t('case:loading-sendingCase') : t('ui:confirmAndSend');

        return <Case className='generateCase'
            title='case:app-generateCaseTitle' description='case:app-generateCaseDescription'
            stepIndicator={2} history={history}>
            <div className='fieldset p-4 mb-4 ml-3 mr-3'>
                <Nav.Row>
                    <Nav.Column>
                        <RenderGeneratedData dataToGenerate={dataToGenerate} dataToConfirm={dataToConfirm}/>
                    </Nav.Column>
                </Nav.Row>
            </div>
            <Nav.Row className='mb-4 p-2'>
                <Nav.Column>
                    <Nav.Knapp className='w-100 backButton' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp>
                </Nav.Column>
                <Nav.Column>
                    <Nav.Hovedknapp className='w-100 forwardButton' disabled={sendingCase} spinner={sendingCase} onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                </Nav.Column>
            </Nav.Row>
        </Case>;
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
