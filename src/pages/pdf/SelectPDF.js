import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import _ from 'lodash';

import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';
import FileUpload from '../../components/ui/FileUpload/FileUpload';
import File from '../../components/ui/File/File';

import * as routes from '../../constants/routes';
import * as pdfActions from '../../actions/pdf';
import * as uiActions from '../../actions/ui';

const mapStateToProps = (state) => {
    return {
        loadingPDF   : state.loading.loadingPDF,
        language     : state.ui.language,
        pdfs         : state.pdf.pdfs,
        loadingExtPDF: state.loading.loadingExtPDF,
        extPdfs      : state.pdf.extPdfs,
        action       : state.ui.action
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, uiActions, pdfActions), dispatch)};
};

class SelectPDF extends Component {

    componentDidMount() {

        const { actions } = this.props;

        actions.addToBreadcrumbs({
            url  : routes.PDF_SELECT,
            ns   : 'pdf',
            label: 'pdf:app-selectPdfTitle'
        });

    }

    onForwardButtonClick() {

        const { history, actions } = this.props;

        actions.navigateForward();
        history.push(routes.PDF_EDIT);
    }

    handleFileChange(files) {

        this.props.actions.selectPDF(files);
    }

    handleBeforeDrop() {

        this.props.actions.loadingFilesStart();
    }

    handleAfterDrop() {

        this.props.actions.loadingFilesEnd();
    }

    addDocument(pdf) {

        this.fileUpload.getWrappedInstance().addFile(pdf);
    }

    onExternalFileRequest() {

        const { actions, extPdfs } = this.props;

        if (!extPdfs) {
            actions.getPdfList();
        }
    }

    render() {

        const { t, history, loadingPDF, loadingExtPDF, pdfs, extPdfs, location } = this.props;

        let buttonText = loadingPDF ? t('pdf:loading-loadingPDF') : t('ui:forward');

        return <TopContainer className='pdf topContainer' history={history} location={location}>
            <Nav.Row className='mb-4'>
                <Nav.Column>
                    <h1 className='appTitle'>{t('pdf:app-selectPdfTitle')}</h1>
                </Nav.Column>
            </Nav.Row>
            <Nav.Ekspanderbartpanel className='m-4 fieldset'
                apen={false} tittel={t('ui:fileSelect')} tittelProps='undertittel'
                onClick={this.onExternalFileRequest.bind(this)}>
                <Nav.HjelpetekstBase>{t('pdf:help-select-pdf')}</Nav.HjelpetekstBase>
                    <div style={{minHeight: '190px'}}>
                    {loadingExtPDF ? <div className='w-100 text-center'>
                         <Nav.NavFrontendSpinner/>
                         <p>{t('pdf:loading-loadingExtPDF')}</p>
                    </div> : null}
                    {extPdfs ? extPdfs.map((pdf, index) => {
                         return <File key={index} file={pdf} addLink={true}
                            onAddDocument={this.addDocument.bind(this, pdf)}
                            currentPage={1}
                         />
                    }) : null}
                    </div>
            </Nav.Ekspanderbartpanel>

            <Nav.Row className='m-4 p-3 fieldset'>
                <Nav.Column>
                    <Nav.HjelpetekstBase>{t('pdf:help-select-pdf')}</Nav.HjelpetekstBase>
                    <h2 className='mb-3'>{t('ui:fileUpload')}</h2>
                    <FileUpload ref={f => this.fileUpload = f}
                        className='fileUpload mb-3'
                        accept='application/pdf'
                        files={pdfs || []}
                        beforeDrop={this.handleBeforeDrop.bind(this)}
                        afterDrop={this.handleAfterDrop.bind(this)}
                        onFileChange={this.handleFileChange.bind(this)}/>
                    <Nav.Row>
                        <Nav.Column></Nav.Column>
                        <Nav.Column>
                            <Nav.Hovedknapp
                                className='forwardButton'
                                style={{width: '100%'}}
                                spinner={loadingPDF}
                                disabled={_.isEmpty(pdfs)}
                                onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                        </Nav.Column>
                    </Nav.Row>
                </Nav.Column>
            </Nav.Row>
        </TopContainer>
    }
}

SelectPDF.propTypes = {
    loadingPDF   : PT.bool,
    actions      : PT.object,
    history      : PT.object,
    t            : PT.func,
    pdfs         : PT.array.isRequired,
    location     : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(SelectPDF)
);
