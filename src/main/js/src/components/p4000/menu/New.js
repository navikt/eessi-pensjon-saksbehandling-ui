import React, { Component } from 'react';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import _ from 'lodash';
import classNames from 'classnames';

import P4000Util from '../Util';
import * as routes from '../../../constants/routes';
import * as p4000Actions from '../../../actions/p4000';
import * as uiActions from '../../../actions/ui';

import * as Nav from '../../ui/Nav';
import Icons from '../../ui/Icons';

const mapStateToProps = (state) => {
    return {
        events        : state.p4000.events,
        dataToConfirm : state.usercase.dataToConfirm,
        dataSaved     : state.usercase.dataSaved
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions, uiActions), dispatch)};
};

const eventList = [
    {label: 'p4000:type-work',      description: 'p4000:type-work-description',      value: 'work',      icon: 'work'},
    {label: 'p4000:type-home',      description: 'p4000:type-home-description',      value: 'home',      icon: 'home'},
    {label: 'p4000:type-child',     description: 'p4000:type-child-description',     value: 'child',     icon: 'child'},
    {label: 'p4000:type-voluntary', description: 'p4000:type-voluntary-description', value: 'voluntary', icon: 'voluntary'},
    {label: 'p4000:type-military',  description: 'p4000:type-military-description',  value: 'military',  icon: 'military'},
    {label: 'p4000:type-birth',     description: 'p4000:type-birth-description',     value: 'birth',     icon: 'birth'},
    {label: 'p4000:type-learn',     description: 'p4000:type-learn-description',     value: 'learn',     icon: 'learn'},
    {label: 'p4000:type-daily',     description: 'p4000:type-daily-description',     value: 'daily',     icon: 'daily'},
    {label: 'p4000:type-sick',      description: 'p4000:type-sick-description',      value: 'sick',      icon: 'sick'},
    {label: 'p4000:type-other',     description: 'p4000:type-other-description',     value: 'other',     icon: 'other'}
];

class New extends Component {

    state = {
        submitted: false
    }

    handleEventSelect(newPage) {

        const { actions } = this.props;
        actions.setPage(newPage);
    }

    componentDidMount() {
        this.props.provideController({
            hasNoValidationErrors : this.hasNoValidationErrors.bind(this),
            passesValidation      : this.passesValidation.bind(this),
            resetValidation       : this.resetValidation.bind(this)
        });
        window.scrollTo(0,0);
    }

    componentDidUpdate() {

        const { history, dataSaved } = this.props;

        if (this.state.submitted && dataSaved ) {

            history.push(routes.ROOT + '?rinaId=' + dataSaved.euxcaseid);
        }
    }

    hasNoValidationErrors() {
        return true;
    }

    resetValidation() {
        return new Promise((resolve) => {
            resolve();
        });
    }

    passesValidation() {

        return new Promise((resolve) => {
            resolve();
        });
    }

    handleFileSave() {

        const { events } = this.props;

        this.setState({
            fileOutput : P4000Util.writeEventsToString(events)
        }, () => {
            this.fileOutput.click()
        })
    }

    handleFileSubmit() {

        const { t, actions } = this.props;

        actions.openModal({
            modalTitle: t('p4000:file-submit-confirm-title'),
            modalText: t('p4000:file-submit-confirm-text'),
            modalButtons: [{
                main: true,
                text: t('ui:yes') + ', ' + t('ui:submit'),
                onClick: this.doSubmitP4000.bind(this)
            },{
                text: t('ui:no') + ', ' + t('ui:cancel'),
                onClick: this.closeModal.bind(this)
            }]
        });
    }

    closeModal() {

        const { actions } = this.props;

        actions.closeModal();
    }

    doSubmitP4000() {

        const { actions, events, dataToConfirm, dataSaved } = this.props;

        let p4000 = P4000Util.convertEventsToP4000(events);
        actions.closeModal();

        let body = {
            subjectArea   : dataToConfirm.subjectArea,
            caseId        : dataToConfirm.caseId,
            actorId       : dataToConfirm.actorId,
            buc           : dataToConfirm.buc,
            sed           : dataToConfirm.sed,
            institutions  : dataToConfirm.institutions
        }

        body.sendsed = true;
        body.payload = JSON.stringify(p4000.payload);
        body.sed = 'P4000';
        body.euxCaseId = dataSaved.euxcaseid

        actions.navigateForward();

        //if (!payload.euxCaseId) {
        //    actions.createSed(payload);
        //} else {
        //actions.addToSed(body);
        //}

        this.setState({
            submitted: true
        }, () => {
            actions.submitP4000(body);
        })
    }

    render() {

        const { t, events } = this.props;

        return <Nav.Panel className='newEventPanel'>
            <div>
                <a className='hiddenFileInputOutput' ref={fileOutput => this.fileOutput = fileOutput}
                    href={this.state.fileOutput} download='p4000.json'>&nbsp;</a>
            </div>
            <Nav.Row className='eventTitle mb-4 p-3 fieldset'>
                <Nav.Column>
                    <Nav.HjelpetekstBase>{t('p4000:help-new-event')}</Nav.HjelpetekstBase>
                    <h1 className='mt-3 mb-3'>{t('ui:new')}{' '}{t('p4000:type-event')}</h1>
                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
                        {eventList.map(e => {
                            return <Nav.Knapp title={t(e.description)} className={classNames('bigButton', e.value + 'Button')}
                                key={e.value} onClick={this.handleEventSelect.bind(this, e.value)}>
                                <div>
                                    <Icons size='4x' kind={e.icon}/>
                                </div>
                                <div className='mt-3'>{t(e.label)}</div>
                            </Nav.Knapp>
                        })}
                    </div>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='eventTitle mb-4 p-3 fieldset'>
                <Nav.Column>
                    <Nav.HjelpetekstBase>{t('p4000:help-new-options')}</Nav.HjelpetekstBase>
                    <h1 className='mt-3 mb-3'>{t('ui:options')}</h1>
                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                        <Nav.Knapp className='viewButton bigButton' onClick={this.handleEventSelect.bind(this, 'view')}>
                            <div>
                                <Icons size='4x' className='mr-3' kind='document'/>
                                <Icons size='3x' kind={'view'}/>
                            </div>
                            <div className='mt-3'>{t('ui:view')}</div>
                        </Nav.Knapp>
                        <Nav.Knapp className='saveButton bigButton' disabled={_.isEmpty(events)} onClick={this.handleFileSave.bind(this)}>
                            <div>
                                <Icons size='4x' className='mr-3' kind='document'/>
                                <Icons size='3x' kind={'download'}/>
                            </div>
                            <div className='mt-3'>{t('p4000:file-save')}</div>
                        </Nav.Knapp>
                        <Nav.Knapp className='sendButton bigButton' disabled={_.isEmpty(events)} onClick={this.handleFileSubmit.bind(this)}>
                            <div>
                                <Icons className='mr-3' size='4x' kind='document'/>
                                <Icons className='mr-3' size='3x' kind='caretRight'/>
                                <Icons size='3x' kind='server'/>
                            </div>
                            <div className='mt-3'>{t('p4000:file-submit')}</div>
                        </Nav.Knapp>
                    </div>
                </Nav.Column>
            </Nav.Row>
        </Nav.Panel>
    }
}

New.propTypes = {
    t                 : PT.func.isRequired,
    actions           : PT.object.isRequired,
    provideController : PT.func.isRequired,
    events            : PT.array
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(New)
);
