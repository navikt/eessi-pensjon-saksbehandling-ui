/* global Uint8Array */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import { Document, Page } from 'react-pdf/dist/entry.noworker';

import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';

import * as pdfActions from '../../actions/pdf';
import * as uiActions from '../../actions/ui';

const mapStateToProps = (state) => {
    return {
        errorMessage : state.alert.clientErrorMessage,
        errorStatus  : state.alert.clientErrorStatus,
        generatingPDF: state.loading.generatingPDF,
        language     : state.ui.language,
        generatedPDF : state.pdf.generatedPDF,
        pdfs         : state.pdf.pdfs

    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, pdfActions, uiActions), dispatch)};
};

class GeneratePDF extends Component {

    state = {};

    base64ToUint8Array(base64string) {
        if (!base64string) {
            return null;
        }
        return Uint8Array.from(window.atob(base64string), c => c.charCodeAt(0))
    }

    componentDidMount() {

        const { history, pdfs } = this.props;

        if (!pdfs) {
            history.push('/react/pdf/select');
        }
    }

    onForwardButtonClick() {

        const { actions } = this.props;
        actions.navigateForward();
    }

    render() {

        const { t, errorMessage, errorStatus, generatingPDF, generatedPDF } = this.props;

        let alert      = errorStatus ? <Nav.AlertStripe type='stopp'>{t('error:' + errorMessage)}</Nav.AlertStripe> : null;
        let buttonText = generatingPDF ? t('pdf:loadingGeneratingPDF') : t('ui:forward');

        return <TopContainer>
            <Nav.Panel className='panel py-4 m-4'>
                <Nav.Row className='mt-4'>
                    <Nav.Column>{t('content:generatePdf')}</Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 text-center'>
                    <Nav.Column>{alert}</Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 text-left'>
                    <Nav.Column>
                        <Document className='document scrollable' file={{data: this.base64ToUint8Array(generatedPDF) }}>
                            <Page className='d-inline-block page' width='100' renderMode='svg' pageNumber={1}/>
                        </Document>
                    </Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4'>
                    <Nav.Column>
                        <Nav.Hovedknapp className='forwardButton' spinner={generatingPDF} onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                    </Nav.Column>
                </Nav.Row>
            </Nav.Panel>
        </TopContainer>
    }
}

GeneratePDF.propTypes = {
    errorMessage : PT.string,
    errorStatus  : PT.string,
    generatingPDF: PT.bool,
    actions      : PT.object,
    history      : PT.object,
    t            : PT.func,
    pdfs         : PT.array.isRequired,
    generatedPDF : PT.obj


};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(GeneratePDF)
);
