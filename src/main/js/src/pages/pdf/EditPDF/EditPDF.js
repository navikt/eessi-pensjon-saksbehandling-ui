import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import Collapse from 'rc-collapse';

import _ from 'lodash';

import * as Nav from '../../../components/ui/Nav';
import TopContainer from '../../../components/ui/TopContainer';
import DnDSource from '../../../components/pdf/DnDSource';
import DnDTarget from '../../../components/pdf/DnDTarget';
import DnD from '../../../components/pdf/DnD';
import PreviewPDF from '../../../components/pdf/PreviewPDF';
import PDFSizeSlider from '../../../components/pdf/PDFSizeSlider';

import 'rc-collapse/assets/index.css';
import './EditPDF.css';

import * as pdfActions from '../../../actions/pdf';
import * as uiActions from '../../../actions/ui';

const mapStateToProps = (state) => {
    return {
        errorMessage : state.alert.clientErrorMessage,
        errorStatus  : state.alert.clientErrorStatus,
        editingPDF   : state.loading.editingPDF,
        language     : state.ui.language,
        pdfs         : state.pdf.pdfs,
        recipe       : state.pdf.recipe,
        pdfsize      : state.pdf.pdfsize,
        dndTarget    : state.pdf.dndTarget
    }
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, pdfActions, uiActions), dispatch)};
};

class EditPDF extends Component {

    componentDidMount() {

        const { history, pdfs } = this.props;

        if (_.isEmpty(pdfs)) {
            history.push('/react/pdf/select');
        }
    }

    onBackButtonClick() {

        const { history, actions } = this.props;

        actions.navigateBack();
        actions.clearPDF();
        history.push('/react/pdf/select');
    }

    onForwardButtonClick() {

        const { history, actions, pdfs, recipe } = this.props;

        actions.navigateForward();
        actions.generatePDF({
            recipe: recipe,
            pdfs: pdfs
        });
        history.push('/react/pdf/generate');
    }

    handleAccordionChange(index) {

        const { actions } = this.props;

        if (!index) {return;}
        actions.setActiveDnDTarget(index);
    }

    render() {

        const { t, errorMessage, errorStatus, editingPDF, pdfs, pdfsize, dndTarget, recipe } = this.props;

        let alert      = errorStatus ? <Nav.AlertStripe type='stopp'>{t('error:' + errorMessage)}</Nav.AlertStripe> : null;
        let buttonText = editingPDF ? t('pdf:loadingEditPDF') : t('ui:forward');

        return <TopContainer>
            <Nav.Panel style={{padding: 0, margin: 0}}>
                <Nav.Row className='mt-4'>
                    <Nav.Column>{t('pdf:editPdf')}</Nav.Column>
                </Nav.Row>
                <Nav.Row className='mt-4 text-center'>
                    <Nav.Column>{alert}</Nav.Column>
                </Nav.Row>
                <PreviewPDF/>
                <DnD>
                    <Nav.Row>
                        <Nav.Column className='col-3'><PDFSizeSlider/></Nav.Column>
                    </Nav.Row>
                    <Nav.Row className='mt-4 text-left'>
                        <Nav.Column className='col-3' style={{maxWidth: pdfsize + 50}}>
                            <Collapse destroyInactivePanel={true} activeKey={dndTarget} accordion={true} onChange={this.handleAccordionChange.bind(this)}>
                              <Collapse.Panel key='work' header={'Work (' + (recipe.work ? recipe.work.length : '0') + ')'} showArrow={true}>
                                  <DnDTarget targetId='work'/>
                              </Collapse.Panel>
                              <Collapse.Panel key='home' header={'Home (' + (recipe.home ? recipe.home.length : '0') + ')'} showArrow={true}>
                                  <DnDTarget targetId='home'/>
                              </Collapse.Panel>
                            <Collapse.Panel key='sick' header={'Sick (' + (recipe.sick ? recipe.sick.length : '0') + ')'} showArrow={true}>
                                  <DnDTarget targetId='sick'/>
                              </Collapse.Panel>
                            <Collapse.Panel key='other' header={'Other (' + (recipe.other ? recipe.other.length : '0') + ')'} showArrow={true}>
                                  <DnDTarget targetId='other'/>
                              </Collapse.Panel>
                            </Collapse>
                        </Nav.Column>
                        <Nav.Column className='col-9'>
                            {pdfs ? pdfs.map(pdf => {return <DnDSource key={pdf.name} pdf={pdf}/>}) : null}
                        </Nav.Column>
                    </Nav.Row>
                </DnD>
            </Nav.Panel>
            <Nav.Panel>
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
