/* global Uint8Array */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { bindActionCreators }  from 'redux';
import _ from 'lodash';

import Icons from '../../../../components/ui/Icons';
import * as Nav from '../../../../components/ui/Nav';
import P4000Util from '../../../../components/p4000/Util';

import * as routes from '../../../../constants/routes';
import * as UrlValidator from '../../../../utils/UrlValidator';
import * as p4000Actions from '../../../../actions/p4000';
import * as uiActions from '../../../../actions/ui';
import './File.css';

const mapStateToProps = (state) => {
    return {
        events        : state.p4000.events,
        event         : state.p4000.event,
        dataToConfirm : state.case.dataToConfirm,
        dataSaved     : state.case.dataSaved
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions, uiActions), dispatch)};
};

class File extends Component {

    state = {
        submitted : false,
        referrer  : undefined
    }

    componentDidMount() {

        const { location } = this.props;

        this.setState({
            referrer: new URLSearchParams(location.search).get('referrer')
        });
    }

    componentDidUpdate() {

        const { history, dataSaved } = this.props;

        if (this.state.submitted && dataSaved ) {

            history.push(routes.ROOT + '?rinaId=' + dataSaved.euxcaseid);
        }
    }

    doNewP4000() {

        const { actions } = this.props;

        actions.closeModal();
        actions.newP4000();
    }

    doOpenP4000() {

        const { actions } = this.props;

        actions.closeModal();
        this.fileInput.click();
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

    handleFileNew() {

        const { t, events, event, actions } = this.props;

        if (!_.isEmpty(event) || !_.isEmpty(events)) {

            actions.openModal({
                modalTitle: t('p4000:file-new-confirm-title'),
                modalText: t('p4000:file-new-confirm-text'),
                modalButtons: [{
                    main: true,
                    text: t('yes') + ', ' + t('continue'),
                    onClick: this.doNewP4000.bind(this)
                },{
                    text: t('no') + ', ' + t('cancel'),
                    onClick: this.closeModal.bind(this)
                }]
            });
        } else {
            this.doNewP4000();
        }
    }

    handleFileOpenFromFile() {

        const { t, actions, event, events } = this.props;

        if (!_.isEmpty(event) || !_.isEmpty(events)) {
            actions.openModal({
                modalTitle: t('p4000:file-open-confirm-title'),
                modalText: t('p4000:file-open-confirm-text'),
                modalButtons: [{
                    main: true,
                    text: t('yes') + ', ' + t('continue'),
                    onClick: this.doOpenP4000.bind(this)
                },{
                    text: t('no') + ', ' + t('cancel'),
                    onClick: this.closeModal.bind(this)
                }]
            });
        } else {
            this.doOpenP4000();
        }
    }

    handleFileOpenFromServer() {

        const { t, actions, event, events } = this.props;

        if (!_.isEmpty(event) || !_.isEmpty(events)) {

            actions.openModal({
                modalTitle: t('p4000:choose'),
                modalText: t('p4000:choose'),
                modalButtons: [{
                    main: true,
                    text: t('yes') + ', ' + t('continue'),
                    onClick: this.doOpenP4000.bind(this)
                },{
                    text: t('no') + ', ' + t('cancel'),
                    onClick: this.closeModal.bind(this)
                }]
            });
        } else {
            this.doOpenP4000();
        }
    }

    handleFileSaveToFile() {

        const { events } = this.props;

        this.setState({
            fileOutput : P4000Util.writeEventsToString(events)
        }, () => {
            this.fileOutput.click()
        })
    }

    handleFileSaveToServer() {

        const { t, actions } = this.props;

        actions.openModal({
            modalTitle: t('soon'),
            modalText: t('soon'),
            modalButtons: [{
                main: true,
                text: t('yes') + ', ' + t('continue'),
                onClick: this.closeModal.bind(this)
            },{
                text: t('no') + ', ' + t('cancel'),
                onClick: this.closeModal.bind(this)
            }]
        });
    }

    handleFileView() {

        const { actions } = this.props;

        actions.setPage('view');
    }

    handleFileNewEvent() {

        const { actions } = this.props;

        actions.setPage('new');
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

    handleFileInputClick(e) {

        const { actions }  = this.props;

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(e.target.files[0]);
            reader.onloadend = (e) => {
                let string = String.fromCharCode.apply(null, new Uint8Array(e.target.result));
                let events = P4000Util.readEventsFromString(string);
                if (typeof events === 'string') {
                    actions.openP4000Failure(events);
                    reject(events);
                } else {
                    actions.openP4000Success(events)
                    resolve(events);
                }
            }
            reader.onerror = error => reject(error);
        })
    }

    handleBackToReferrerRequest() {

        const { history, actions } = this.props;

        if (UrlValidator.validateReferrer(this.state.referrer)) {
            actions.deleteLastBreadcrumb();
            history.push(routes.ROOT + this.state.referrer);
        }
    }

    render() {

        const { t, events, event } = this.props;

        return <Nav.Panel className='c-p4000-menu-file mt-4 p-0'>
            <Nav.Row style={{animationDelay: '-0.3s'}} className='fileButtons fieldset no-gutters'>
                <Nav.Column>
                    <Nav.HjelpetekstBase>{t('p4000:help-file-info')}</Nav.HjelpetekstBase>
                    <h2 className='mb-4'>{t('p4000:file-title')}</h2>
                    <Nav.Row>
                        <Nav.Column>
                            <Nav.Row className='fileButton no-gutters'>
                                <Nav.Column className='col-auto buttonColumn'>
                                    <Nav.Knapp className='bigButton newP4000Button' onClick={this.handleFileNew.bind(this)}>
                                        <div>
                                            <Icons className='mr-3' size='3x' kind='plus'/>
                                            <Icons size='4x' kind='file'/>
                                        </div>
                                        <div className='mt-3'>{t('p4000:file-new')}</div>
                                    </Nav.Knapp>
                                </Nav.Column>
                                <Nav.Column className='text-left'>
                                    <ul className='fileDescriptionList'>
                                        <li>{t('p4000:file-new-description-1')}</li>
                                        <li>{t('p4000:file-new-description-2')}</li>
                                    </ul>
                                </Nav.Column>
                            </Nav.Row>

                            <Nav.Row style={{animationDelay: '0.1s'}} className='fileButton no-gutters'>
                                <Nav.Column className='col-auto buttonColumn'>
                                    <Nav.Knapp className='bigButton openP4000FromFileButton' onClick={this.handleFileOpenFromFile.bind(this)}>
                                        <div>
                                            <Icons className='mr-3' size='3x' kind='upload'/>
                                            <Icons size='4x' kind='file'/>
                                        </div>
                                        <div className='mt-3'>{t('p4000:file-open-from-file')}</div>
                                    </Nav.Knapp>
                                    <input className='hiddenFileInputOutput' type='file' ref={fileInput => this.fileInput = fileInput}
                                        onChange={this.handleFileInputClick.bind(this)}
                                    />
                                </Nav.Column>
                                <Nav.Column className='text-left'>
                                    <ul className='fileDescriptionList'>
                                        <li>{t('p4000:file-open-from-file-description-1')}</li>
                                        <li>{t('p4000:file-open-from-file-description-2')}</li>
                                        <li>{t('p4000:file-open-from-file-description-3')}</li>
                                        <li>{t('p4000:file-open-from-file-description-4')}</li>
                                    </ul>
                                </Nav.Column>
                            </Nav.Row>

                            <Nav.Row style={{animationDelay: '0.2s'}} className='fileButton no-gutters'>
                                <Nav.Column className='col-auto buttonColumn'>
                                    <Nav.Knapp className='bigButton openP4000FromServerButton' onClick={this.handleFileOpenFromServer.bind(this)}>
                                        <div>
                                            <Icons size='3x' className='mr-3' kind='server'/>
                                            <Icons className='mr-3' size='3x' kind='caretRight'/>
                                            <Icons size='4x' kind='document'/>
                                        </div>
                                        <div className='mt-3'>{t('p4000:file-open-from-server')}</div>
                                    </Nav.Knapp>

                                </Nav.Column>
                                <Nav.Column className='text-left'>
                                    <ul className='fileDescriptionList'>
                                        <li>{t('p4000:file-open-from-server-description-1')}</li>
                                        <li>{t('p4000:file-open-from-server-description-2')}</li>
                                        <li>{t('p4000:file-open-from-server-description-3')}</li>
                                    </ul>
                                </Nav.Column>
                            </Nav.Row>

                            <Nav.Row style={{animationDelay: '0.3s'}} className='fileButton no-gutters'>
                                <Nav.Column className='col-auto buttonColumn'>
                                    <Nav.Knapp className='bigButton viewP4000Button' onClick={this.handleFileView.bind(this)} disabled={event === undefined}>
                                        <div>
                                            <Icons className='mr-3' size='4x' kind='file'/>
                                            <Icons size='3x' kind='view'/>
                                        </div>
                                        <div className='mt-3'>{t('p4000:file-view')}</div>
                                    </Nav.Knapp>
                                </Nav.Column>
                                <Nav.Column className='text-left'>
                                    <ul className='fileDescriptionList'>
                                        <li>{t('p4000:file-view-description-1')}</li>
                                    </ul>
                                </Nav.Column>
                            </Nav.Row>

                        </Nav.Column>
                        <Nav.Column>

                            <Nav.Row style={{animationDelay: '0.4s'}} className='fileButton no-gutters'>
                                <Nav.Column className='col-auto buttonColumn'>
                                    <Nav.Knapp className='bigButton newEventButton' onClick={this.handleFileNewEvent.bind(this)} disabled={event === undefined}>
                                        <div>
                                            <Icons className='mr-3' size='4x' kind='file'/>
                                            <Icons size='3x' kind='calendar'/>
                                        </div>
                                        <div className='mt-3'>{t('p4000:file-new-event')}</div>
                                    </Nav.Knapp>
                                </Nav.Column>
                                <Nav.Column className='text-left'>
                                    <ul className='fileDescriptionList'>
                                        <li>{t('p4000:file-new-events-description-1')}</li>
                                    </ul>
                                </Nav.Column>
                            </Nav.Row>

                            <Nav.Row style={{animationDelay: '0.5s'}} className='fileButton no-gutters'>
                                <Nav.Column className='col-auto buttonColumn'>
                                    <a className='hiddenFileInputOutput' ref={fileOutput => this.fileOutput = fileOutput}
                                        href={this.state.fileOutput} download='p4000.json'>&nbsp;</a>
                                    <Nav.Knapp className='bigButton saveP4000ToFileButton' disabled={_.isEmpty(events)}
                                        onClick={this.handleFileSaveToFile.bind(this)}>
                                        <div>
                                            <Icons className='mr-3' size='4x' kind='document'/>
                                            <Icons size='3x' kind='download'/>
                                        </div>
                                        <div className='mt-3'>{t('p4000:file-save-to-file')}</div>
                                    </Nav.Knapp>
                                </Nav.Column>
                                <Nav.Column className='text-left'>
                                    <ul className='fileDescriptionList'>
                                        <li>{t('p4000:file-save-to-file-description-1')}</li>
                                        <li>{t('p4000:file-save-to-file-description-2')}</li>
                                        <li>{t('p4000:file-save-to-file-description-3')}</li>
                                    </ul>
                                </Nav.Column>
                            </Nav.Row>

                            <Nav.Row style={{animationDelay: '0.6s'}} className='fileButton no-gutters'>
                                <Nav.Column className='col-auto buttonColumn'>
                                    <Nav.Knapp className='bigButton saveP4000toServerButton' disabled={_.isEmpty(events)}
                                        onClick={this.handleFileSaveToServer.bind(this)}>
                                        <div>
                                            <Icons className='mr-3' size='4x' kind='document'/>
                                            <Icons className='mr-3' size='3x' kind='caretRight'/>
                                            <Icons size='3x' kind='server'/>
                                        </div>
                                        <div className='mt-3'>{t('p4000:file-save-to-server')}</div>
                                    </Nav.Knapp>
                                </Nav.Column>
                                <Nav.Column className='text-left'>
                                    <ul className='fileDescriptionList'>
                                        <li>{t('p4000:file-save-to-server-description-1')}</li>
                                        <li>{t('p4000:file-save-to-server-description-2')}</li>
                                    </ul>
                                </Nav.Column>
                            </Nav.Row>

                            <Nav.Row style={{animationDelay: '0.7s'}} className='fileButton no-gutters'>
                                <Nav.Column className='col-auto buttonColumn'>
                                    <Nav.Knapp className='bigButton submitP4000Button' disabled={_.isEmpty(events)}
                                        onClick={this.handleFileSubmit.bind(this)}>
                                        <div>
                                            <Icons className='mr-3' size='4x' kind='document'/>
                                            <Icons className='mr-3' size='3x' kind='caretRight'/>
                                            <Icons size='3x' kind='server'/>
                                        </div>
                                        <div className='mt-3'>{t('p4000:file-submit')}</div>
                                    </Nav.Knapp>
                                </Nav.Column>
                                <Nav.Column className='text-left'>
                                    <ul className='fileDescriptionList'>
                                        <li>{t('p4000:file-submit-description-1')}</li>
                                        <li>{t('p4000:file-submit-description-2')}</li>
                                    </ul>
                                </Nav.Column>
                            </Nav.Row>
                        </Nav.Column>
                    </Nav.Row>
                </Nav.Column>
            </Nav.Row>
            {this.state.referrer ? <Nav.Row>
                <Nav.Column>
                    <Nav.Hovedknapp className='backToReferrerButton' onClick={this.handleBackToReferrerRequest.bind(this)}>{t('ui:backTo') + ' ' + t('ui:' + this.state.referrer)}</Nav.Hovedknapp>
                </Nav.Column>
                <Nav.Column/>
            </Nav.Row> : null }
        </Nav.Panel>
    }
}

File.propTypes = {
    t       : PT.func.isRequired,
    actions : PT.object.isRequired,
    events  : PT.array.isRequired,
    event   : PT.object,
    history : PT.object.isRequired,
    location: PT.object.isRequired,
    dataSaved     : PT.object,
    dataToConfirm : PT.object
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(File)
);
