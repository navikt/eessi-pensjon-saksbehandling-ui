import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import _ from 'lodash';
import classNames from 'classnames';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import DnDExternalFiles from '../../components/pdf/DnDExternalFiles/DnDExternalFiles';
import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';
import FileUpload from '../../components/ui/FileUpload/FileUpload';


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

const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'lightgreen' : 'white',
    padding: 0
});

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

    requestExternalFileList() {

        const { actions, extPdfs } = this.props;

        if (!extPdfs) {
            actions.getPdfList();
        }
    }

    addPdfToFileUpload(e) {

        const { extPdfs } = this.props;

        if (e.source && e.source.droppableId === 'dndfiles' &&
            e.destination && e.destination.droppableId === 'fileUploadDroppable') {

            let sourcePdf = extPdfs[e.source.index];
            this.fileUpload.getWrappedInstance().addFile(sourcePdf);
        }
        return;
    }

    render() {

        const { t, history, loadingPDF, loadingExtPDF, pdfs, extPdfs, location } = this.props;

        let buttonText = loadingPDF ? t('pdf:loading-loadingPDF') : t('ui:forward');

        return <TopContainer className='pdf topContainer' history={history} location={location}>
            <DragDropContext onDragEnd={this.addPdfToFileUpload.bind(this)}>
                <h1 className='appTitle'>{t('pdf:app-selectPdfTitle')}</h1>
                <Nav.Ekspanderbartpanel className='m-4 fieldset'
                    apen={false} tittel={t('ui:fileSelect')} tittelProps='undertittel'
                    onClick={this.requestExternalFileList.bind(this)}>
                    <Nav.HjelpetekstBase>{t('pdf:help-select-pdf')}</Nav.HjelpetekstBase>
                    <div style={{minHeight: '20 0px'}}>
                        {loadingExtPDF ? <div className='w-100 text-center'>
                            <Nav.NavFrontendSpinner/>
                            <p>{t('pdf:loading-loadingExtPDF')}</p>
                        </div> : <DnDExternalFiles extPdfs={extPdfs}/>}
                    </div>
                </Nav.Ekspanderbartpanel>

                <div className='m-4 p-4 fieldset'>
                    <Nav.HjelpetekstBase>{t('pdf:help-select-pdf')}</Nav.HjelpetekstBase>
                    <h2 className='mb-3'>{t('ui:fileUpload')}</h2>
                    <Droppable droppableId={'fileUploadDroppable'} direction='horizontal'>
                        {(provided, snapshot) => (
                            <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                                <FileUpload ref={f => this.fileUpload = f}
                                    className={classNames('fileUpload', 'mb-3')}
                                    accept='application/pdf'
                                    files={pdfs || []}
                                    beforeDrop={this.handleBeforeDrop.bind(this)}
                                    afterDrop={this.handleAfterDrop.bind(this)}
                                    onFileChange={this.handleFileChange.bind(this)}/>
                            </div>
                        )}
                    </Droppable>
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
            </DragDropContext>
        </TopContainer>
    }
}

SelectPDF.propTypes = {
    loadingPDF   : PT.bool,
    loadingExtPDF: PT.bool,
    actions      : PT.object,
    history      : PT.object,
    t            : PT.func,
    pdfs         : PT.array.isRequired,
    extPdfs      : PT.array,
    location     : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(SelectPDF)
);
