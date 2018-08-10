import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import _ from 'lodash';

import * as Nav from '../../components/ui/Nav';
import TopContainer from '../../components/ui/TopContainer';
import FileUpload from '../../components/ui/FileUpload/FileUpload';
import Icons from '../../components/ui/Icons';

import * as pdfActions from '../../actions/pdf';
import * as uiActions from '../../actions/ui';

const mapStateToProps = (state) => {
    return {
        loadingPDF   : state.loading.loadingPDF,
        language     : state.ui.language,
        pdfs         : state.pdf.pdfs,
        action       : state.ui.action
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, uiActions, pdfActions), dispatch)};
};

class SelectPDF extends Component {

    onForwardButtonClick() {

        const { history, actions } = this.props;

        actions.navigateForward();
        history.push('/react/pdf/edit');
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

    render() {

        const { t, history, loadingPDF, pdfs } = this.props;

        let buttonText = loadingPDF ? t('pdf:loading-loadingPDF') : t('ui:forward');

        return <TopContainer className='topContainer'>
            <Nav.Row className='mb-4'>
                <Nav.Column>
                    <h1 className='mt-3 appTitle'>
                        <Icons title={t('ui:back')} className='mr-3' style={{cursor: 'pointer'}} kind='caretLeft' onClick={() => history.push('/')}/>
                        {t('pdf:selectPdfTitle')}
                    </h1>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='m-3 p-3 fieldset'>
                <Nav.Column>
                    <Nav.HjelpetekstBase>{t('pdf:help-select-pdf')}</Nav.HjelpetekstBase>
                    <h2 className='mb-3'>{t('ui:fileSelect')}</h2>
                    <span>{'Soon'}</span>
                </Nav.Column>
            </Nav.Row>

            <Nav.Row className='m-3 p-3 fieldset'>
                <Nav.Column>
                    <Nav.HjelpetekstBase>{t('pdf:help-select-pdf')}</Nav.HjelpetekstBase>
                    <h2 className='mb-3'>{t('ui:fileUpload')}</h2>
                    <FileUpload className='mb-3'
                        accept='application/pdf'
                        files={pdfs}
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
    errorMessage : PT.string,
    errorStatus  : PT.string,
    loadingPDF   : PT.bool,
    actions      : PT.object,
    history      : PT.object,
    t            : PT.func,
    action       : PT.string,
    pdfs         : PT.array.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(SelectPDF)
);
