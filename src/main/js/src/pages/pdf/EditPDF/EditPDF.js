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
import Icons from '../../../components/ui/Icons';

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

    state = {
        modalOpen: false
    }

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

    hasOnlyEmptyArrays(obj) {

        var emptyArrayMembers = _.filter(obj, (it) => {
            return !it || (_.isArray(it) && _.isEmpty(it))
        });
        return emptyArrayMembers.length === Object.keys(obj).length;
    }

    onForwardButtonClick() {

        const { t, recipe } = this.props;

        if (this.hasOnlyEmptyArrays(recipe)) {

            this.setState({
                modalOpen: true,
                modalTitle: t('pdf:recipe-empty'),
                modalText: t('pdf:recipe-empty-text'),
                modalButtons: [{
                    main: true,
                    text: t('ui:ok-got-it'),
                    onClick: this.closeModal
                }]
            });

        } else {

            this.setState({
                modalOpen: true,
                modalTitle: t('pdf:recipe-valid'),
                modalText: t('pdf:recipe-valid-text'),
                modalButtons: [{
                    main: true,
                    text: t('ui:yes') + ', ' + t('ui:generate'),
                    onClick: this.goToGenerate
                },{
                    text: t('ui:cancel'),
                    onClick: this.closeModal
                }]
            });
        }
    }

    goToGenerate() {

        const { history, actions } = this.props;

        actions.navigateForward();
        history.push('/react/pdf/generate');
    }

    handleAccordionChange(index) {

        const { actions } = this.props;

        if (!index) {return;}
        actions.setActiveDnDTarget(index);
    }

    closeModal() {

        this.setState({modalOpen: false});
    }

    render() {

        const { t, history, errorMessage, errorStatus, editingPDF, pdfs, pdfsize, dndTarget, recipe } = this.props;

        let alert      = errorStatus ? <Nav.AlertStripe type='stopp'>{t('error:' + errorMessage)}</Nav.AlertStripe> : null;
        let buttonText = editingPDF ? t('pdf:loadingEditPDF') : t('ui:forward');

        return <TopContainer className='topContainer'>
            <Nav.Modal isOpen={this.state.modalOpen}
                onRequestClose={this.closeModal.bind(this)}
                closeButton={false}
                contentLabel='contentLabel'>
                <div className='m-3 text-center'><h4>{this.state.modalTitle}</h4></div>
                <div className='m-4 text-center'>{this.state.modalText}</div>
                <div className='text-center'>{this.state.modalButtons ? this.state.modalButtons.map(button => {
                    return button.main ?
                        <Nav.Hovedknapp className='mr-3 mb-3' key={button.text} onClick={button.onClick.bind(this)}>{button.text}</Nav.Hovedknapp>
                        : <Nav.Knapp className='mr-3 mb-3' key={button.text} onClick={button.onClick.bind(this)}>{button.text}</Nav.Knapp>
                }) : null}
                </div>
            </Nav.Modal>
            <Nav.Row>
                <Nav.Column>
                    <h1 className='mt-3 appTitle'>
                        <Icons title={t('ui:back')} className='mr-3' style={{cursor: 'pointer'}} kind='caretLeft' onClick={() => history.push('/')}/>
                        {t('pdf:editPdfTitle')}
                    </h1>
                </Nav.Column>
            </Nav.Row>
            {alert ? <Nav.Row className='mt-3 mb-3'>
                <Nav.Column>{alert}</Nav.Column>
            </Nav.Row> : null}
            <PreviewPDF/>
            <Nav.Row className='mb-2'>
                <Nav.Column className='col-md-3'>
                    <PDFSizeSlider/>
                </Nav.Column>
                <Nav.Column className='col-md-9'>
                    <Nav.HjelpetekstBase>{t('pdf:help-edit-pdf')}</Nav.HjelpetekstBase>
                </Nav.Column>
            </Nav.Row>
            <Nav.Row className='mb-4'>
                <DnD>
                    <Nav.Column className='col-sm-2 mb-4' style={{maxWidth: pdfsize + 50}}>
                        <Collapse destroyInactivePanel={true} activeKey={dndTarget} accordion={true} onChange={this.handleAccordionChange.bind(this)}>
                            <Collapse.Panel key='work' header={t('pdf:work') + ' (' + (recipe.work ? recipe.work.length : '0') + ')'} showArrow={true}>
                                <DnDTarget targetId='work'/>
                            </Collapse.Panel>
                            <Collapse.Panel key='home' header={t('pdf:home') + ' (' + (recipe.home ? recipe.home.length : '0') + ')'} showArrow={true}>
                                <DnDTarget targetId='home'/>
                            </Collapse.Panel>
                            <Collapse.Panel key='sick' header={t('pdf:sick') + ' (' + (recipe.sick ? recipe.sick.length : '0') + ')'} showArrow={true}>
                                <DnDTarget targetId='sick'/>
                            </Collapse.Panel>
                            <Collapse.Panel key='other' header={t('pdf:other') + ' (' + (recipe.other ? recipe.other.length : '0') + ')'} showArrow={true}>
                                <DnDTarget targetId='other'/>
                            </Collapse.Panel>
                        </Collapse>
                    </Nav.Column>
                    <Nav.Column className='col-sm-10 mb-4'>
                        <div className='h-100'>
                            {! pdfs ? null : <Collapse className='mb-4' defaultActiveKey={Array(pdfs.length).fill().map((v, i) => {return '' + i})}
                                destroyInactivePanel={false} accordion={false}>
                                {pdfs.map((pdf, i) => {
                                    return <Collapse.Panel key={i} header={pdf.name} showArrow={true}>
                                        <DnDSource pdf={pdf}/>
                                    </Collapse.Panel>
                                })}
                            </Collapse>
                            }
                            <Nav.Row className='mb-4'>
                                <Nav.Column>
                                    <Nav.Knapp className='backButton w-100' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp>
                                </Nav.Column>
                                <Nav.Column>
                                    <Nav.Hovedknapp className='forwardButton w-100' spinner={editingPDF} onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
                                </Nav.Column>
                            </Nav.Row>
                        </div>
                    </Nav.Column>
                </DnD>
            </Nav.Row>
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
    recipe       : PT.array.isRequired,
    pdfsize      : PT.number,
    dndTarget    : PT.string
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(EditPDF)
);
