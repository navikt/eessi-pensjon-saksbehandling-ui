import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';

import * as Nav from '../components/Nav';
import TopContainer from '../components/TopContainer';
import DnDSource from '../components/DnDSource';
import DnDTarget from '../components/DnDTarget';
import DnD from '../components/DnD';
import PreviewPDF from '../components/PreviewPDF';

import * as pdfActions from '../actions/pdf';
import * as uiActions from '../actions/ui';

import './pdf.css';

const mapStateToProps = (state) => {
    return {
        errorMessage : state.error.clientErrorMessage,
        errorStatus  : state.error.clientErrorStatus,
        editingPDF   : state.loading.editingPDF,
        language     : state.ui.language,
        pdfs         : state.pdf.pdfs,
        recipe       : state.pdf.recipe
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, pdfActions, uiActions), dispatch)};
};

class EditPDF extends Component {

    componentDidMount() {

        const { history, pdfs } = this.props;

        if (!pdfs) {
            history.push('/react/selectPDF');
        }
    }

    onBackButtonClick() {

        const { history, actions } = this.props;

        actions.navigateBack();
        actions.clearPDF();
        history.push('/react/selectPDF');
    }

    onForwardButtonClick() {

        const { history, actions, pdfs, recipe } = this.props;

        actions.navigateForward();
        actions.generatePDF({
            recipe: recipe,
            pdfs: pdfs
        });
        history.push('/react/generatePDF');
    }

    render() {

        const { t, errorMessage, errorStatus, editingPDF, pdfs } = this.props;

        let alert      = errorStatus ? <Nav.AlertStripe type='stopp'>{t('error:' + errorMessage)}</Nav.AlertStripe> : null;
        let buttonText = editingPDF ? t('loading:editPDF') : t('ui:forward');

        return <TopContainer>
            <Nav.Panel className='panel'>
                <Nav.Row className='mt-4'>
                    <Nav.Column>{t('content:editPdf')}</Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 text-center'>
                    <Nav.Column>{alert}</Nav.Column>
                </Nav.Row>
                <PreviewPDF/>
                <DnD>
                    <Nav.Row className='mt-4 text-left'>
                        <Nav.Column className='col-3'>
                            <DnDTarget/>
                        </Nav.Column>
                        <Nav.Column>
                            {pdfs ? pdfs.map(pdf => {return <DnDSource key={pdf.fileName} pdf={pdf}/>}) : null}
                        </Nav.Column>
                    </Nav.Row>
                </DnD>
                <Nav.Row className='mt-4'>
                    <Nav.Column>
                        <Nav.Knapp className='backButton' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp>
                        <Nav.Hovedknapp className='forwardButton' spinner={editingPDF} onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                    </Nav.Column>
                </Nav.Row>
            </Nav.Panel>
        </TopContainer>
    }
}

EditPDF.propTypes = {
    errorMessage : PT.string,
    errorStatus  : PT.string,
    editingPDF   : PT.bool,
    actions      : PT.object,
    history      : PT.object,
    t            : PT.func,
    pdfs         : PT.array.isRequired,
    recipe       : PT.array.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(EditPDF)
);
