import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import * as Nav from '../components/Nav';
import TopContainer from '../components/TopContainer';

import * as usercaseActions from '../actions/usercase';

const mapStateToProps = (state) => {
    return {
        dataToConfirm   : state.usercase.dataToConfirm,
        dataSubmitted   : state.usercase.dataSubmitted,
        errorMessage    : state.error.clientErrorMessage,
        errorStatus     : state.error.clientEerrorStatus,
        loading         : state.loading,
        language        : state.ui.language
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, usercaseActions), dispatch)};
};

class ConfirmEditCase extends Component {

    componentWillMount() {

        let { history, dataToConfirm } = this.props;

        if (!dataToConfirm) {
            history.push('/');
        }
    }

    componentWillReceiveProps(nextProps) {

        const { history } = this.props;
        if (nextProps.dataSubmitted) {
            history.push('/react/end');
        }
    }

    onBackButtonClick() {

        const { history, actions } = this.props;
        actions.cancelDataToConfirm();
        history.goBack();
    }

    onButtonClick() {

        const { actions, dataToConfirm } = this.props;
        actions.submitData(dataToConfirm);
    }

    render() {

        const { t, dataToConfirm, errorStatus, errorMessage, loading } = this.props;

        if (!dataToConfirm) {
            return <TopContainer/>
        }

        let alert;
        let spinner = loading && loading.postcase;
        let buttonText = spinner ? t('loading:postcase') : t('ui:confirmAndSend');

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
                        <Nav.Knapp className='mr-4' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('ui:tilbake')}</Nav.Knapp>
                        <Nav.Hovedknapp spinner={spinner} onClick={this.onButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                    </Nav.Column>
                </Nav.Row>
            </Nav.Panel>
        </TopContainer>;
    }
}

ConfirmEditCase.propTypes = {
    actions       : PT.object.isRequired,
    history       : PT.object.isRequired,
    loading       : PT.object.isRequired,
    t             : PT.func,
    dataToConfirm : PT.object,
    dataSubmitted : PT.object,
    errorStatus   : PT.object,
    errorMessage  : PT.object
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(ConfirmEditCase)
);
