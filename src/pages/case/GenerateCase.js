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
        dataSaved      : state.usercase.dataSaved,
        savingCase     : state.loading.savingCase,
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

        const { history, dataSaved, action } = this.props;

        if (dataSaved && action === 'forward') {
            history.push('/_/case/save');
        }
    }

    onBackButtonClick() {

        const { history, actions } = this.props;

        actions.navigateBack();
        history.push('/_/case/confirm')
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

        if (!payload.euxCaseId) {
            actions.createSed(payload);
        } else {
            actions.addToSed(payload);
        }
    }

    render() {

        const { t, history, dataToGenerate, dataToConfirm, savingCase } = this.props;

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

        let buttonText = savingCase ? t('case:loading-savingCase') : t('ui:confirmAndSave');

        return <Case className='generateCase'
            title='case:app-generateCaseTitle' description='case:app-generateCaseDescription'
            stepIndicator={2} history={history}>
            <div className='fieldset p-4 m-4'>
                <Nav.Row>
                    <Nav.Column>
                        <RenderGeneratedData dataToGenerate={dataToGenerate} dataToConfirm={dataToConfirm}/>
                    </Nav.Column>
                </Nav.Row>
            </div>
            <Nav.Row className='mb-4 p-4'>
                <div className='col-md-6 mb-2'>
                    <Nav.Knapp className='w-100 backButton' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp>
                </div>
                <div className='col-md-6 mb-2'>
                    <Nav.Hovedknapp className='w-100 forwardButton' disabled={savingCase} spinner={savingCase} onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                </div>
            </Nav.Row>
        </Case>;
    }
}

GenerateCase.propTypes = {
    actions        : PT.object.isRequired,
    history        : PT.object.isRequired,
    savingCase     : PT.bool,
    t              : PT.func.isRequired,
    dataToConfirm  : PT.object,
    dataToGenerate : PT.object.isRequired,
    dataSaved      : PT.object,
    action         : PT.string
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(GenerateCase)
);
