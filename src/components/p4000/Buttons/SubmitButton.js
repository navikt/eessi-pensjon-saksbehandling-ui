import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import Icons from '../../ui/Icons';
import * as Nav from '../../ui/Nav';
import P4000Util from '../Util';

import * as uiActions from '../../../actions/ui';
import * as p4000Actions from '../../../actions/p4000';

const mapStateToProps = (state) => {
    return {
        events   : state.p4000.events,
        rinaId   : state.status.rinaId,
        sakId    : state.status.sakId,
        aktoerId : state.status.aktoerId
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, uiActions, p4000Actions), dispatch)};
};

class SubmitButton extends Component {

    doSubmitP4000() {

        const { actions, events, sakId, aktoerId, rinaId } = this.props;

        let p4000 = P4000Util.convertEventsToP4000(events);
        actions.closeModal();

        let body = {
            caseId    : sakId,
            actorId   : aktoerId,
            payload   : JSON.stringify(p4000.payload),
            sed       : 'P4000',
            euxCaseId : rinaId
        }

        actions.navigateForward();

        this.setState({
            submitted: true
        }, () => {
            actions.submitP4000(body);
        })
    }

    closeModal() {

        const { actions } = this.props;

        actions.closeModal();
    }

    handleFileSubmit() {

        const { t, actions } = this.props;

        actions.openModal({
            modalTitle: t('p4000:file-submit-confirm-title'),
            modalText: t('p4000:file-submit-confirm-text'),
            modalButtons: [{
                main: true,
                text: t('yes') + ', ' + t('submit'),
                onClick: this.doSubmitP4000.bind(this)
            },{
                text: t('no') + ', ' + t('cancel'),
                onClick: this.closeModal.bind(this)
            }]
        });
    }

    render () {

        const { t, events, style } = this.props;

        return  <Nav.Knapp title={t('p4000:file-submit-description-1') + '\n'+ t('p4000:file-submit-description-2')}
            style={style} className='bigButton submitP4000Button' disabled={_.isEmpty(events)}
            onClick={this.handleFileSubmit.bind(this)}>
            <div>
                <Icons className='mr-3' size='4x' kind='document'/>
                <Icons className='mr-3' size='3x' kind='caretRight'/>
                <Icons size='3x' kind='server'/>
            </div>
            <div className='mt-3'>{t('p4000:file-submit')}</div>
        </Nav.Knapp>
    }
}

SubmitButton.propTypes = {
    t       : PT.func.isRequired,
    events  : PT.array.isRequired,
    style   : PT.object,
    actions : PT.object,
    aktoerId: PT.string,
    sakId   : PT.string,
    rinaId  : PT.string
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(SubmitButton)
);
