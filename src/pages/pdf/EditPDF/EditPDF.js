import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';
import PT from 'prop-types';
import { translate } from 'react-i18next';
import Collapse from 'rc-collapse';
import _ from 'lodash';

import * as Nav from '../../../components/ui/Nav';
import TopContainer from '../../../components/ui/TopContainer';
import ClientAlert from '../../../components/ui/Alert/ClientAlert';
import DnDSource from '../../../components/pdf/DnDSource/DnDSource';
import DnDTarget from '../../../components/pdf/DnDTarget/DnDTarget';
import DnD from '../../../components/pdf/DnD';
import PDFSizeSlider from '../../../components/pdf/PDFSizeSlider';
import PdfDrawer from '../../../components/drawer/Pdf';

import 'rc-collapse/assets/index.css';
import './EditPDF.css';

import * as routes from '../../../constants/routes';
import * as pdfActions from '../../../actions/pdf';
import * as uiActions from '../../../actions/ui';

const mapStateToProps = (state) => {
    return {
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

        const { history, actions, pdfs } = this.props;

        if (_.isEmpty(pdfs)) {
            history.push(routes.PDF_SELECT);
        }

        actions.addToBreadcrumbs({
            url  : routes.PDF_EDIT,
            ns   : 'pdf',
            label: 'pdf:app-editPdfTitle'
        });
    }

    onBackButtonClick() {

        const { history, actions } = this.props;

        actions.navigateBack();
        history.push(routes.PDF_SELECT);
    }

    hasOnlyEmptyArrays(obj) {

        var emptyArrayMembers = _.filter(obj, (it) => {
            return !it || (_.isArray(it) && _.isEmpty(it))
        });
        return emptyArrayMembers.length === Object.keys(obj).length;
    }

    onForwardButtonClick() {

        const { t, recipe, actions } = this.props;

        if (this.hasOnlyEmptyArrays(recipe)) {

            actions.openModal({
                modalTitle: t('pdf:recipe-empty-title'),
                modalText: t('pdf:recipe-empty-text'),
                modalButtons: [{
                    main: true,
                    text: t('ui:ok-got-it'),
                    onClick: this.closeModal.bind(this)
                }]
            });

        } else {

            actions.openModal({
                modalTitle: t('pdf:recipe-valid-title'),
                modalText: t('pdf:recipe-valid-text'),
                modalButtons: [{
                    main: true,
                    text: t('ui:yes') + ', ' + t('ui:generate'),
                    onClick: this.goToGenerate.bind(this)
                },{
                    text: t('ui:cancel'),
                    onClick: this.closeModal.bind(this)
                }]
            });
        }
    }

    goToGenerate() {

        const { history, actions } = this.props;

        actions.closeModal();
        actions.navigateForward();
        history.push(routes.PDF_GENERATE);
    }

    handleAccordionChange(index) {

        const { actions } = this.props;

        if (!index) {
            return;
        }
        actions.setActiveDnDTarget(index);
    }

    closeModal() {

        const { actions } = this.props;

        actions.closeModal();
    }

    render() {

        const { t, history, pdfs, pdfsize, dndTarget, recipe, location } = this.props;

        return <TopContainer className='pdf topContainer'
            history={history} location={location}
            sideContent={<PdfDrawer/>}>
            <div className='mt-4'>
                <Nav.HjelpetekstBase>{t('pdf:help-edit-pdf')}</Nav.HjelpetekstBase>
            </div>
            <h1 className='appTitle'>{t('pdf:app-editPdfTitle')}</h1>
            <ClientAlert/>
            <div className={'m-4'} style={{width: '20%'}}>
                 <PDFSizeSlider/>
            </div>
            <Nav.Row className='m-4'>
                <DnD>
                    <Nav.Column className='col-sm-2 mb-4' style={{maxWidth: pdfsize + 50}}>
                        <Collapse className='dndtargets' destroyInactivePanel={true} activeKey={dndTarget} accordion={true} onChange={this.handleAccordionChange.bind(this)}>
                            <Collapse.Panel key='work' header={t('pdf:form-work') + ' (' + (recipe.work ? recipe.work.length : '0') + ')'} showArrow={true}>
                                <DnDTarget targetId='work'/>
                            </Collapse.Panel>
                            <Collapse.Panel key='home' header={t('pdf:form-home') + ' (' + (recipe.home ? recipe.home.length : '0') + ')'} showArrow={true}>
                                <DnDTarget targetId='home'/>
                            </Collapse.Panel>
                            <Collapse.Panel key='sick' header={t('pdf:form-sick') + ' (' + (recipe.sick ? recipe.sick.length : '0') + ')'} showArrow={true}>
                                <DnDTarget targetId='sick'/>
                            </Collapse.Panel>
                            <Collapse.Panel key='other' header={t('pdf:form-other') + ' (' + (recipe.other ? recipe.other.length : '0') + ')'} showArrow={true}>
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
                                    <Nav.Hovedknapp className='forwardButton w-100'
                                        disabled={this.hasOnlyEmptyArrays(recipe)}
                                        onClick={this.onForwardButtonClick.bind(this)}>
                                        {t('ui:forward')}
                                    </Nav.Hovedknapp>
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
    actions      : PT.object,
    history      : PT.object,
    t            : PT.func,
    pdfs         : PT.array.isRequired,
    recipe       : PT.object.isRequired,
    pdfsize      : PT.number,
    dndTarget    : PT.string,
    location     : PT.object.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(EditPDF)
);
