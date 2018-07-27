/* global Uint8Array */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import { bindActionCreators }  from 'redux';
import _ from 'lodash';

import Icons from '../../../components/ui/Icons';
import * as Nav from '../../../components/ui/Nav';
import P4000Util from '../../../components/p4000/Util';

import * as p4000Actions from '../../../actions/p4000';

const mapStateToProps = (state) => {
    return {
        events : state.p4000.events,
        event  : state.p4000.event
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, p4000Actions), dispatch)};
};

const styles = {
    button: {
        width: '200px',
        height: '200px'
    }
}

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
                modalText: t('p4000:file-new-confirm'),
                modalButtons: [{
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
                modalText: t('p4000:file-new-confirm'),
                modalButtons: [{
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

        let p4000 = P4000Util.convertEventsToP4000(events);
        let data = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(p4000));

        this.setState({
            fileOutput : data
        }, () => {
            this.fileOutput.click()
        })
    }

    handleFileSubmit() {}

    handleFileInputClick(e) {

        const { actions }  = this.props;

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(e.target.files[0]);
            reader.onloadend = (e) => {
                let string = String.fromCharCode.apply(null, new Uint8Array(e.target.result));
                let events = P4000Util.getEventsFromLoadedJson(string);
                actions.openP4000(events)
                resolve(events);
            }
            reader.onerror = error => reject(error);
        })
    }

    render() {

        const { t, events } = this.props;

        return <div className='div-file'>
            <Nav.Modal isOpen={this.state.modalOpen}
                onRequestClose={this.closeModal.bind(this)}
                closeButton={false}
                contentLabel='contentLabel'>
                <div>{this.state.modalText}</div>
                <div>{this.state.modalButtons ? this.state.modalButtons.map(button => {
                    return <Nav.Knapp key={button.text} onClick={button.onClick.bind(this)}>{button.text}</Nav.Knapp>
                }) : null}
                </div>
            </Nav.Modal>
            <Nav.Row className='fileButtons mb-4 p-4 fieldset'>
                <Nav.Column className='text-center'>
                    <Nav.Knapp style={styles.button} onClick={this.handleFileNew.bind(this)}>
                        <div><Icons size='4x' kind='file-new'/></div>
                        <div>{t('p4000:file-new')}</div>
                    </Nav.Knapp>
                </Nav.Column>
                <Nav.Column className='text-center'>
                    <input type='file' ref={fileInput => this.fileInput = fileInput}
                        style={{opacity: 0, float: 'right', width: 0}}
                        onChange={this.handleFileInputClick.bind(this)}
                    />
                    <Nav.Knapp style={styles.button} onClick={this.handleFileOpen.bind(this)}>
                        <div><Icons size='4x' kind='file-open'/></div>
                        <div>{t('p4000:file-open')}</div>
                    </Nav.Knapp>
                </Nav.Column>
                <div style={{width: '100%', height: '20px'}}/>
                <Nav.Column className='text-center'>
                    <a ref={fileOutput => this.fileOutput = fileOutput}
                        style={{opacity: 0, float: 'right', width: 0}}
                        href={'data:' + this.state.fileOutput} download='p4000.json'>&nbsp;</a>
                    <Nav.Knapp style={styles.button} disabled={_.isEmpty(events)}
                        onClick={this.handleFileSave.bind(this)}>
                        <div><Icons size='4x' kind='p4000'/></div>
                        <div>{t('p4000:file-save')}</div>
                    </Nav.Knapp>
                </Nav.Column>
                <Nav.Column className='text-center'>
                    <Nav.Knapp style={styles.button} disabled={true} onClick={this.handleFileSubmit.bind(this)}>
                        <div><Icons size='4x' kind='p4000'/></div>
                        <div>{t('p4000:file-submit')}</div>
                    </Nav.Knapp>
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
