import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import _ from 'lodash';
import classNames from 'classnames';

import ExternalFiles from '../../../components/pdf/ExternalFiles/ExternalFiles';
import * as Nav from '../../../components/ui/Nav';
import TopContainer from '../../../components/ui/TopContainer/TopContainer';
import FileUpload from '../../../components/ui/FileUpload/FileUpload';
import PdfDrawer from '../../../components/drawer/Pdf';

import * as routes from '../../../constants/routes';
import * as pdfActions from '../../../actions/pdf';
import * as uiActions from '../../../actions/ui';
import * as appActions from '../../../actions/app';

import './SelectPDF.css';

const mapStateToProps = (state) => {
    return {
        loadingPDF   : state.loading.loadingPDF,
        language     : state.ui.language,
        pdfs         : state.pdf.pdfs,
        action       : state.ui.action
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, appActions, uiActions, pdfActions), dispatch)};
};

class SelectPDF extends Component {

    componentDidMount() {

        const { actions } = this.props;

        actions.addToBreadcrumbs({
            url  : routes.PDF_SELECT,
            ns   : 'pdf',
            label: 'pdf:app-selectPdfTitle'
        });

        actions.registerDroppable('selectPdf', this.fileUpload);
    }

    componentWillUnmount() {

        const { actions } = this.props;

        actions.unregisterDroppable('selectPdf');
    }

    onForwardButtonClick() {

        const { history, actions } = this.props;

        actions.navigateForward();
        history.push(routes.PDF_EDIT);
    }

    handleFileChange(files) {

        const { actions } = this.props;

        actions.selectPDF(files);
    }

    handleBeforeDrop() {

        const { actions } = this.props;

        actions.loadingFilesStart();
    }

    handleAfterDrop() {

        const { actions } = this.props;

        actions.loadingFilesEnd();
    }

    addDocument(pdf) {

        this.fileUpload.getWrappedInstance().addFile(pdf);
    }

    render() {

        const { t, history, loadingPDF, pdfs, location } = this.props;

        let buttonText = loadingPDF ? t('pdf:loading-loadingPDF') : t('ui:forward');

        return <TopContainer className='p-pdf-selectPdf'
            history={history} location={location}
            sideContent={<PdfDrawer/>}>
            <h1 className='appTitle'>{t('pdf:app-selectPdfTitle')}</h1>
            <ExternalFiles style={{zIndex: 2}} addDocument={this.addDocument.bind(this)}/>
            <div style={{animation: 'none', opacity: 1}} className='fieldset mt-4'>

                <Nav.HjelpetekstBase>{t('pdf:help-select-pdf')}</Nav.HjelpetekstBase>
                <h2 className='mb-3'>{t('ui:fileUpload')}</h2>
                <FileUpload ref={f => this.fileUpload = f} fileUploadDroppableId={'selectPdf'}
                    className={classNames('fileUpload', 'mb-3')}
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
            </div>
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
