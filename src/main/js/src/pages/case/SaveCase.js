import React, { Component } from 'react';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Case from './Case';
import * as Nav from '../../components/ui/Nav';

import * as usercaseActions from '../../actions/usercase';
import * as uiActions from '../../actions/ui';

const mapStateToProps = (state) => {
    return {
        dataToConfirm : state.usercase.dataToConfirm,
        dataSaved     : state.usercase.dataSaved,
        dataSent      : state.usercase.dataSent,
        sendingCase   : state.loading.sendingCase,
        rinaUrl       : state.usercase.rinaUrl,
        rinaLoading   : state.loading.rinaUrl
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, uiActions, usercaseActions), dispatch)};
};

class SaveCase extends Component {

    state = {};

    componentDidMount() {

        let { history, actions, dataSaved, dataSent } = this.props;

        if (!dataSaved) {
            history.push('/');
        } else {
            actions.getRinaUrl();
        }
    }

    componentDidUpdate() {

        const { history, dataSent, action } = this.props;

        if (dataSent) {
            history.push('/react/case/send');
        }
    }

    onBackButtonClick() {

        const { history, actions } = this.props;

        actions.navigateBack();
        history.push('/react/case/generate')
    }

    onForwardButtonClick() {

        const { actions, dataSaved, dataToConfirm } = this.props;

        actions.navigateForward();

         let payload = {
            subjectArea  : dataToConfirm.subjectArea,
            caseId       : dataToConfirm.caseId,
            actorId      : dataToConfirm.actorId,
            buc          : dataToConfirm.buc,
            sed          : dataToConfirm.sed,
            institutions : dataToConfirm.institutions,
            sendsed      : true,
            euxCaseId    : dataSaved.euxcaseid
         }

        actions.sendSed(payload);
    }

    render() {

        let { t, history, sendingCase, dataSaved, rinaLoading, rinaUrl } = this.props;

        let body;

        if (rinaLoading) {
            body = t('case:loading-rinaUrl')
        } else {
            if (rinaUrl && dataSaved && dataSaved.euxcaseid) {
                body = <div>
                    <a href={rinaUrl + dataSaved.euxcaseid}>{t('case:form-caseLink')}</a>
                    <h4>{t('case:form-rinaId') + ': ' + dataSaved.euxcaseid}</h4>
                </div>
            } else {
                body = null;
            }
        }

        let buttonText = sendingCase ? t('case:loading-sendingCase') : t('ui:confirmAndSend');

        return <Case className='saveCase'
            title='case:app-saveCaseTitle' description='case:app-saveCaseDescription'
            stepIndicator={3} history={history}>
            <div className='fieldset p-4 mb-4 ml-3 mr-3'>
                <Nav.Row>
                    <Nav.Column className='saveCase'>
                        {body}
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

SaveCase.propTypes = {
    action      : PT.string,
    actions     : PT.object,
    history     : PT.object,
    dataSaved   : PT.object,
    dataSent    : PT.bool,
    sendingCase : PT.bool,
    t           : PT.func,
    rinaLoading : PT.bool,
    rinaUrl     : PT.string
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(SaveCase)
);
