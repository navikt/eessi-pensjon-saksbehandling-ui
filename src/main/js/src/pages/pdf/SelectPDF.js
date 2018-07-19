import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';
import SelectedPDF from '../../components/pdf/SelectedPDF';

import * as pdfActions from '../../actions/pdf';
import * as uiActions from '../../actions/ui';

const mapStateToProps = (state) => {
    return {
        errorMessage : state.error.clientErrorMessage,
        errorStatus  : state.error.clientErrorStatus,
        gettingCase  : state.loading.gettingCase,
        language     : state.ui.language,
        pdfs         : state.pdf.pdfs
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, uiActions, pdfActions), dispatch)};
};

class SelectPDF extends Component {

    state = {
        pdfs: [],
        numPages: []
    };

    onForwardButtonClick() {

        const {actions} = this.props;

        actions.navigateForward();
        let pdfs = this.state.pdfs;
        let numPages = this.state.numPages;
        for (var i in pdfs) {
            pdfs[i]['numPages'] = numPages[i];
        }
        actions.selectPDF(pdfs);
    }

    componentDidUpdate() {

        const { history, pdfs } = this.props;
        if (pdfs) {
            history.push('/react/pdf/edit');
        }
    }

    onLoadSuccess (arrayPosition, e) {

        let numPages = this.state.numPages;
        numPages[arrayPosition] = e.numPages;
        this.setState({numPages: numPages});
    }

    onDeleteDocument (arrayPosition) {

        let pdfs = this.state.pdfs;
        let numPages = this.state.numPages;
        pdfs.splice(arrayPosition, 1);
        numPages.splice(arrayPosition, 1)
        this.setState({
            pdfs: pdfs,
            numPages: numPages
        });
    }

    onFileChange(e) {

        let arrayPosition = this.state.pdfs.length;
        let fileName = e.target.value.split('\\').pop();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(e.target.files[0]);
            reader.onloadend = (e) => {
                let pdfs = this.state.pdfs;
                let data = new Uint8Array(e.target.result);
                let base64 = window.btoa(String.fromCharCode(...data));
                pdfs[arrayPosition] = {
                    'base64'   : base64,
                    'data'     : data,
                    'fileName' : fileName
                }
                this.setState({pdfs: pdfs})
                resolve(e.target.result);
            }
            reader.onerror = error => reject(error);
        })
    }


    renderFileUpload() {

        return <input type='file' onChange={this.onFileChange.bind(this)}/>
    }

    renderPDFs() {

        if (!this.state.pdfs) {
            return null;
        }

        let html = this.state.pdfs.map((pdf, i) => {
            let pageNumbers = this.state.numPages[i];
            return <SelectedPDF
                key={pageNumbers}
                pdf={pdf}
                onLoadSuccess={this.onLoadSuccess.bind(this, i)}
                onDeleteDocument={this.onDeleteDocument.bind(this, i)}
                pageNumbers={pageNumbers}
            />
        });

        return <div className='scrollable'>{html}</div>
    }

    render() {

        const { t, errorMessage, errorStatus, gettingPDF } = this.props;

        let alert      = errorStatus ? <Nav.AlertStripe type='stopp'>{t('error:' + errorMessage)}</Nav.AlertStripe> : null;
        let buttonText = gettingPDF ? t('loading:gettingPDF') : t('ui:forward');

        return <TopContainer>
            <Nav.Panel className='panel'>
                <Nav.Row className='mt-4'>
                    <Nav.Column>{t('content:choosePdf')}</Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 text-center'>
                    <Nav.Column>{alert}</Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 text-left'>
                    <Nav.Column>
                        {this.renderFileUpload()}
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 text-left'>
                    <Nav.Column>
                        {this.renderPDFs()}

                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4'>
                    <Nav.Column>
                        <Nav.Hovedknapp className='forwardButton' spinner={gettingPDF} onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                    </Nav.Column>
                </Nav.Row>
            </Nav.Panel>
        </TopContainer>
    }
}

SelectPDF.propTypes = {
    errorMessage : PT.string,
    errorStatus  : PT.string,
    gettingPDF   : PT.bool,
    actions      : PT.object,
    history      : PT.object,
    t            : PT.func,
    pdfs         : PT.array.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(SelectPDF)
);
