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
        history.push('/react/case/get/' + dataToConfirm.caseId + '/' + dataToConfirm.actorId + '/' + dataSaved.euxcaseid);
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
            <div className='fieldset p-4 mb-4 ml-3 mr-3'>
                <Nav.Row>
                    <Nav.Column className='sendCase'>
                        <div>{t('case:form-caseSent')}</div>
                    </Nav.Column>
                </Nav.Row>
            </div>
            <Nav.Row className='mb-4 p-2'>
                <Nav.Column>
                    <Nav.Knapp className='w-100 createNewButton' onClick={this.onCreateNewButtonClick.bind(this)}>{t('ui:createNew')}</Nav.Knapp>
                </Nav.Column>
                <Nav.Column>
                    <Nav.Hovedknapp className='w-100 goToStartButton' onClick={this.onGoToStartButtonClick.bind(this)}>{t('ui:goToStart')}</Nav.Hovedknapp>
                </Nav.Column>
            </Nav.Row>
        </Case>;
    }
}

SendCase.propTypes = {
    actions       : PT.object,
    history       : PT.object,
    dataSent      : PT.bool,
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
