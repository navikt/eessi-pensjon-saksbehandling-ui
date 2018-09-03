import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import _ from 'lodash';

import * as Nav from '../../../components/ui/Nav';
import TopContainer from '../../../components/ui/TopContainer';
import ClientAlert from '../../../components/ui/Alert/ClientAlert';
import File from '../../../components/ui/File/File';
import Icons from '../../../components/ui/Icons';

import * as routes from '../../../constants/routes';
import * as pdfActions from '../../../actions/pdf';
import * as uiActions from '../../../actions/ui';

import './GeneratePDF.css';

const mapStateToProps = (state) => {
    return {
        generatingPDF : state.loading.generatingPDF,
        language      : state.ui.language,
        generatedPDFs : state.pdf.generatedPDFs,
        pdfs          : state.pdf.pdfs,
        recipe        : state.pdf.recipe
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, pdfActions, uiActions), dispatch)};
};

class GeneratePDF extends Component {

    state = {
        fileNames: {}
    };

    static getDerivedStateFromProps(props, state) {

        if (!_.isEmpty(props.generatedPDFs) && _.isEmpty(state.fileNames)) {

            let fileNames = {};

            Object.keys(props.generatedPDFs).map(key => {
                fileNames[key] = props.generatedPDFs[key].name;
                return key;
            });

            return {
                fileNames: fileNames
            }
        }
    }

    componentDidMount() {

        const { history, actions, pdfs, recipe } = this.props;

        if (!pdfs || _.isEmpty(pdfs)) {

            history.push(routes.PDF_SELECT);

        } else {

            actions.generatePDF({
                recipe : recipe,
                pdfs   : pdfs
            });
        }
    }

    onBackButtonClick() {

        const { history, actions } = this.props;

        actions.navigateBack();
        history.push(routes.PDF_EDIT);
    }

    onForwardButtonClick() {

        const { history, actions } = this.props;

        actions.navigateForward();
        actions.clearPDF();
        history.push(routes.PDF_SELECT);
    }

    setFileName(key, e) {

        let newFileNames = _.clone(this.state.fileNames);
        newFileNames[key] = e.target.value;

        this.setState({
            fileNames: newFileNames
        });
    }

    downloadAll() {

        const { generatedPDFs } = this.props;

        Object.keys(generatedPDFs).map(key => {
            this[key].click();
            return key;
        });
    }

    render() {

        const { t, history, generatingPDF, generatedPDFs } = this.props;
        let buttonText = generatingPDF ? t('pdf:loading-generatingPDF') : t('ui:startAgain');

        return <TopContainer className='pdf topContainer'>
            <Nav.Row>
                <Nav.Column>
                    <Nav.HjelpetekstBase>{t('pdf:help-generate-pdf')}</Nav.HjelpetekstBase>
                    <h1 className='mt-3 appTitle'>
                        <Icons title={t('ui:back')} className='mr-3' style={{cursor: 'pointer'}} kind='caretLeft' onClick={() => history.push(routes.ROOT)}/>
                        {t('pdf:app-generatePdfTitle')}
                    </h1>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='mt-4 text-center' style={{minHeight: '100px'}}>
                <Nav.Column>
                    <ClientAlert/>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='mt-4 text-left'>
                <Nav.Column>
                    {generatingPDF ? <div className='w-100 text-center'>
                        <Nav.NavFrontendSpinner/>
                        <p>{t('pdf:loading-generatingPDF')}</p>
                    </div> : (generatedPDFs ? <div>
                        {Object.keys(generatedPDFs).map(key => {
                            let pdf = generatedPDFs[key];
                            return <div key={key} className='fieldset p-2 mb-3 w-100'>
                                <Nav.Row className='pdfrow'>
                                    <Nav.Column>
                                        <File file={pdf}/>
                                    </Nav.Column>
                                    <Nav.Column>
                                        <Nav.Input label={t('ui:filename')} value={this.state.fileNames[key]}
                                            onChange={this.setFileName.bind(this, key)}/>
                                    </Nav.Column>
                                    <Nav.Column className='text-right'>
                                        <a className='hiddenLink' ref={item => this[key] = item}
                                            onClick={(e) => e.stopPropagation()} title={t('ui:download')}
                                            href={'data:application/octet-stream;base64,' + encodeURIComponent(pdf.base64)}
                                            download={this.state.fileNames[key]}>{t('ui:download')}</a>
                                        <Nav.Knapp className='downloadButton' onClick={() => this[key].click()}>{t('ui:download')}</Nav.Knapp>
                                    </Nav.Column>
                                </Nav.Row>
                            </div>
                        })}
                        <Nav.Row>
                            <Nav.Column className='text-right'>
                                <Nav.Knapp className='w-25 downloadAllButton' onClick={this.downloadAll.bind(this)}>{t('ui:downloadAll')}</Nav.Knapp>
                            </Nav.Column>
                        </Nav.Row>
                    </div> : null)}
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='mt-4'>
                <Nav.Column>
                    <Nav.Knapp className='backButton w-100' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp>
                </Nav.Column>
                <Nav.Column>
                    <Nav.Hovedknapp disabled={generatingPDF} className='forwardButton w-100' onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                </Nav.Column>
            </Nav.Row>
        </TopContainer>
    }
}

GeneratePDF.propTypes = {
    generatingPDF: PT.bool,
    actions      : PT.object,
    history      : PT.object,
    t            : PT.func,
    pdfs         : PT.array.isRequired,
    recipe       : PT.array.isRequired,
    generatedPDFs: PT.object
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(GeneratePDF)
);
