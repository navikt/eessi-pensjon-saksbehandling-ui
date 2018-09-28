import React, { Component } from 'react';
import PT from 'prop-types';
import { bindActionCreators }  from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import * as Nav from '../../ui/Nav';
import DnDExternalFiles from '../DnDExternalFiles/DnDExternalFiles';
import * as pdfActions from '../../../actions/pdf';

const mapStateToProps = (state) => {
    return {
        loadingExtPDF: state.loading.loadingExtPDF,
        extPdfs      : state.pdf.extPdfs
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, pdfActions), dispatch)};
};

class ExternalFiles extends Component {

    requestExternalFileList() {

        const { actions, extPdfs } = this.props;

        if (!extPdfs) {
            actions.getExternalFileList();
        }
    }

    render () {

        const { t, loadingExtPDF, extPdfs, addDocument } = this.props;

        return <Nav.Ekspanderbartpanel className='m-4 fieldset'
            apen={false} tittel={t('ui:fileSelect')} tittelProps='undertittel'
            onClick={this.requestExternalFileList.bind(this)}>
            <Nav.HjelpetekstBase>{t('pdf:help-select-pdf')}</Nav.HjelpetekstBase>
            <div style={{minHeight: '200px'}}>
                {loadingExtPDF ? <div className='w-100 text-center'>
                    <Nav.NavFrontendSpinner/>
                    <p>{t('pdf:loading-loadingExtPDF')}</p>
                </div> : <DnDExternalFiles extPdfs={extPdfs || []} addDocument={addDocument}/>}
            </div>
        </Nav.Ekspanderbartpanel>
    }
}

ExternalFiles.propTypes = {
    t             : PT.func.isRequired,
    loadingExtPDF : PT.bool,
    extPdfs       : PT.array,
    actions       : PT.object,
    addDocument   : PT.func
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    translate()(ExternalFiles)
);

