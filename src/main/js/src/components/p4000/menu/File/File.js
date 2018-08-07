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

import * as p4000Actions from '../../../../actions/p4000';
import './File.css';

const mapStateToProps = (state) => {
    return {
        events : state.p4000.events,
        event  : state.p4000.event
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

class File extends Component {

    state = {
        modalOpen: false
    }

    closeModal() {
        this.setState({modalOpen: false});
    }

    doNewP4000() {
        this.props.actions.newP4000();
    }

    doOpenP4000() {
        this.fileInput.click();
    }

    doCancelNewP4000() {
        this.closeModal();
    }

    doCancelOpenP4000() {
        this.closeModal();
    }

    handleFileNew() {

        const { t, events, event } = this.props;

        if (!_.isEmpty(event) || !_.isEmpty(events)) {
            this.setState({
                modalOpen: true,
                modalTitle: t('p4000:file-new-confirm-title'),
                modalText: t('p4000:file-new-confirm-text'),
                modalButtons: [{
                    main: true,
                    text: t('ui:yes-continue'),
                    onClick: this.doNewP4000
                },{
                    text: t('ui:no-cancel'),
                    onClick: this.doCancelNewP4000
                }]
            })
        } else {
            this.doNewP4000();
        }
    }

    handleFileOpen() {

        const { t, events, event } = this.props;

        if (!_.isEmpty(event) || !_.isEmpty(events)) {
            this.setState({
                modalOpen: true,
                modalTitle: t('p4000:file-open-confirm-title'),
                modalText: t('p4000:file-open-confirm-text'),
                modalButtons: [{
                    main: true,
                    text: t('ui:yes-continue'),
                    onClick: this.doOpenP4000
                },{
                    text: t('ui:no-cancel'),
                    onClick: this.doCancelOpenP4000
                }]
            })
        } else {
            this.doOpenP4000();
        }
    }

    handleFileSave() {

        const { events } = this.props;

        this.setState({
            fileOutput : P4000Util.writeEventsToString(events)
        }, () => {
            this.fileOutput.click()
        })
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

        const { events, actions } = this.props;

        let p4000 = P4000Util.convertEventsToP4000(events);

        actions.submit(p4000);
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

    render() {

        const { t, events, event } = this.props;

        return <div className='div-file'>
            <Nav.Modal isOpen={this.state.modalOpen}
                onRequestClose={this.closeModal.bind(this)}
                closeButton={false}
                contentLabel='contentLabel'>
                <div className='m-3 text-center'><h4>{this.state.modalTitle}</h4></div>
                <div className='m-4 text-center'>{this.state.modalText}</div>
                <div className='text-center'>{this.state.modalButtons ? this.state.modalButtons.map(button => {
                    return button.main ?
                        <Nav.Hovedknapp className='mr-3' key={button.text} onClick={button.onClick.bind(this)}>{button.text}</Nav.Hovedknapp>
                        : <Nav.Knapp className='mr-3' key={button.text} onClick={button.onClick.bind(this)}>{button.text}</Nav.Knapp>
                }) : null}
                </div>
            </Nav.Modal>
            <Nav.HjelpetekstBase>{t('p4000:help-file-info')}</Nav.HjelpetekstBase>
            <h2 className='mb-5'>{t('p4000:file-title')}</h2>
            <Nav.Row className='fileButtons mb-4 p-4 fieldset'>
                <Nav.Column>
                    <Nav.Row className='mb-3 no-gutters'>
                        <Nav.Column className='col-auto buttonColumn'>
                            <Nav.Knapp className='fileButton' onClick={this.handleFileNew.bind(this)}>
                                <div>
                                    <Icons className='mr-3' size='4x' kind='file'/>
                                    <Icons size='3x' kind='plus'/>
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

                    <Nav.Row className='mb-3 no-gutters'>
                        <Nav.Column className='col-auto buttonColumn'>
                            <Nav.Knapp className='fileButton' onClick={this.handleFileOpen.bind(this)}>
                                <div>
                                    <Icons size='4x' kind='file-open'/>
                                </div>
                                <div className='mt-3'>{t('p4000:file-open')}</div>
                            </Nav.Knapp>
                            <input className='hiddenFileInputOutput' type='file' ref={fileInput => this.fileInput = fileInput}
                                onChange={this.handleFileInputClick.bind(this)}
                            />
                        </Nav.Column>
                        <Nav.Column className='text-left'>
                            <ul className='fileDescriptionList'>
                                <li>{t('p4000:file-open-description-1')}</li>
                                <li>{t('p4000:file-open-description-2')}</li>
                                <li>{t('p4000:file-open-description-3')}</li>
                                <li>{t('p4000:file-open-description-4')}</li>
                            </ul>
                        </Nav.Column>
                    </Nav.Row>

                     <Nav.Row className='mb-3 no-gutters'>
                        <Nav.Column className='col-auto buttonColumn'>
                            <Nav.Knapp className='fileButton' onClick={this.handleFileView.bind(this)} disabled={event === undefined}>
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

                    <Nav.Row className='mb-3 no-gutters'>
                        <Nav.Column className='col-auto buttonColumn'>
                            <Nav.Knapp className='fileButton' onClick={this.handleFileNewEvent.bind(this)} disabled={event === undefined}>
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

                    <Nav.Row className='mb-3 no-gutters'>
                        <Nav.Column className='col-auto buttonColumn'>
                            <a className='hiddenFileInputOutput' ref={fileOutput => this.fileOutput = fileOutput}
                                href={this.state.fileOutput} download='p4000.json'>&nbsp;</a>
                            <Nav.Knapp className='fileButton' disabled={_.isEmpty(events)}
                                onClick={this.handleFileSave.bind(this)}>
                                <div>
                                    <Icons className='mr-3' size='4x' kind='p4000'/>
                                    <Icons size='3x' kind='download'/>
                                </div>
                                <div className='mt-3'>{t('p4000:file-save')}</div>
                            </Nav.Knapp>
                        </Nav.Column>
                        <Nav.Column className='text-left'>
                            <ul className='fileDescriptionList'>
                                <li>{t('p4000:file-save-description-1')}</li>
                                <li>{t('p4000:file-save-description-2')}</li>
                                <li>{t('p4000:file-save-description-3')}</li>
                            </ul>
                        </Nav.Column>
                    </Nav.Row>

                    <Nav.Row className='mb-3 no-gutters'>
                        <Nav.Column className='col-auto buttonColumn'>
                            <Nav.Knapp className='fileButton' disabled={_.isEmpty(events)}
                                onClick={this.handleFileSubmit.bind(this)}>
                                <div>
                                    <Icons className='mr-3' size='4x' kind='p4000'/>
                                    <Icons className='mr-3' size='3x' kind='caretRight'/>
                                    <Icons size='3x' kind='server'/>
                                </div>
                                <div className='mt-3' >{t('p4000:file-submit')}</div>
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
        </div>
    }
}

File.propTypes = {
    t       : PT.func.isRequired,
    actions : PT.object.isRequired,
    events  : PT.array.isRequired,
    event   : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(File)
);
