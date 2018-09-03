import React, { Component } from 'react';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Case from './Case';
import * as Nav from '../../components/ui/Nav';

import * as usercaseActions from '../../actions/usercase';

const mapStateToProps = (state) => {
    return {
        dataToConfirm : state.usercase.dataToConfirm,
        dataSent      : state.usercase.dataSent,
        dataSaved     : state.usercase.dataSaved
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, usercaseActions), dispatch)};
};

class SendCase extends Component {

    state = {};

    onCreateNewButtonClick() {

        const { history, actions, dataToConfirm, dataSaved } = this.props;

        actions.clearData();
        history.push('/_/case/get/' + dataToConfirm.caseId + '/' + dataToConfirm.actorId + '/' + dataSaved.euxcaseid);
    }

    onGoToStartButtonClick() {

        const { history, actions, dataSaved } = this.props;

        actions.clearData();
        history.push('/?rinaId=' + dataSaved.euxcaseid);
    }

    render() {

        let { t, history } = this.props;

        return <Case className='sendCase'
            title='case:app-sendCaseTitle' description='case:app-sendCaseDescription'
            stepIndicator={4} history={history}>
            <div className='fieldset p-4 m-4'>
                <Nav.Row>
                    <Nav.Column className='sendCase'>
                        <div>{t('case:form-caseSent')}</div>
                    </Nav.Column>
                </Nav.Row>
            </div>
            <Nav.Row className='mb-4 p-4'>
                <div className='col-md-6 mb-2'>
                    <Nav.Knapp className='w-100 createNewButton' onClick={this.onCreateNewButtonClick.bind(this)}>{t('ui:createNew')}</Nav.Knapp>
                </div>
                <div className='col-md-6 mb-2'>
                    <Nav.Hovedknapp className='w-100 goToStartButton' onClick={this.onGoToStartButtonClick.bind(this)}>{t('ui:goToStart')}</Nav.Hovedknapp>
                </div>
            </Nav.Row>
        </Case>;
    }
}

SendCase.propTypes = {
    actions       : PT.object,
    history       : PT.object,
    dataSaved     : PT.object,
    dataToConfirm : PT.object,
    t             : PT.func
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(SendCase)
);
