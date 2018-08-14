import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import * as Nav from '../../components/ui/Nav';
import RenderConfirmData from '../../components/case/RenderConfirmData';
import Case from './Case';

import * as usercaseActions from '../../actions/usercase';
import * as uiActions from '../../actions/ui';

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

        const { history, dataToGenerate, dataToConfirm, action } = this.props;

        if (!dataToConfirm) {
            history.push('/');
        }

        if (dataToGenerate && action === 'forward') {
            history.push('/react/case/generate');
        }
    }

    onBackButtonClick() {

        const { history, actions, dataToConfirm } = this.props;

        actions.navigateBack();
        history.push('/react/case/get/' + dataToConfirm.caseId + '/' + dataToConfirm.actorId +
            (dataToConfirm.rinaId ? '/' + dataToConfirm.rinaId : null));
    }

    onForwardButtonClick() {

        const { actions, dataToConfirm } = this.props;

        actions.navigateForward();
        actions.generateData({
            subjectArea   : dataToConfirm.subjectArea,
            caseId        : dataToConfirm.caseId,
            actorId       : dataToConfirm.actorId,
            rinaId        : dataToConfirm.rinaId,
            buc           : dataToConfirm.buc,
            sed           : dataToConfirm.sed,
            institutions  : dataToConfirm.institutions
        });
    }

    render() {

        const { t, history, dataToConfirm, generatingCase } = this.props;

        let buttonText = generatingCase ? t('case:loading-generatingCase') : t('ui:confirmAndGenerate');

        if (!dataToConfirm) {
            return null;
        }

        return <Case className='confirmCase'
            title='case:app-confirmCaseTitle' description='case:app-confirmCaseDescription'
            stepIndicator={1} history={history}>
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
        </Case>;
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
